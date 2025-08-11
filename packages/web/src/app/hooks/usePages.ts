import { useCallback, useEffect, useState, useRef } from "react";
import type { Page, PositionedPage } from "../types";
import { uid } from "../utils";
import { notesAPI } from "../api";
import { localStorageAPI } from "../utils/localStorage";

export function usePages() {
  // 노트북 내부 페이지(순서 유지)
  const [pages, setPages] = useState<Page[]>([]);
  // 찢은 페이지(자유 배치)
  const [loosePages, setLoosePages] = useState<PositionedPage[]>([]);
  // 휴지통(자유 배치)
  const [trashPages, setTrashPages] = useState<PositionedPage[]>([]);
  const [loading, setLoading] = useState(true);

  // 좌표값이 없는 PositionedPage에 랜덤 좌표 추가
  const ensurePositions = useCallback(
    (pages: (Page | PositionedPage)[]): PositionedPage[] => {
      return pages.map((page) => ({
        ...page,
        x: "x" in page ? page.x : 40 + Math.random() * 120,
        y: "y" in page ? page.y : 40 + Math.random() * 80,
      }));
    },
    [],
  );

  // 데이터 초기 로딩
  useEffect(() => {
    const loadData = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      if (token) {
        // 로그인된 사용자: API 사용
        try {
          const [notesData, tornData, trashedData] = await Promise.all([
            notesAPI.getNotes(),
            notesAPI.getTornNotes(),
            notesAPI.getTrashedNotes(),
          ]);

          setPages(notesData || []);
          setLoosePages(ensurePositions(tornData || []));
          setTrashPages(ensurePositions(trashedData || []));
        } catch (error) {
          console.error("Failed to load notes from API:", error);
          // API 실패 시 로컬스토리지로 폴백
          loadFromLocalStorage();
        }
      } else {
        // 비로그인 사용자: 로컬스토리지 사용
        loadFromLocalStorage();
      }

      setLoading(false);
    };

    const loadFromLocalStorage = () => {
      const notesData = localStorageAPI.getNotes();
      const tornData = localStorageAPI.getTornNotes();
      const trashedData = localStorageAPI.getTrashedNotes();

      setPages(notesData);
      setLoosePages(ensurePositions(tornData));
      setTrashPages(ensurePositions(trashedData));
    };

    loadData();
  }, [ensurePositions]);

  // debounce를 위한 ref
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // 공통 유틸: 특정 페이지 내용 업데이트(현재 위치에 따라 pages/loose/trash 중 해당하는 곳에서 반영)
  const updateContent = useCallback(async (pageId: string, content: string) => {
    // 로컬 상태 즉시 업데이트
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, content } : p)),
    );
    setLoosePages((prev) =>
      prev.map((pp) => (pp.id === pageId ? { ...pp, content } : pp)),
    );
    setTrashPages((prev) =>
      prev.map((pp) => (pp.id === pageId ? { ...pp, content } : pp)),
    );

    // 기존 타이머 제거
    const existingTimer = debounceTimers.current.get(pageId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // 새로운 debounced 업데이트 (로그인 상태에 따라 API/로컬스토리지 선택)
    const timer = setTimeout(async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : null;

        if (token) {
          // 로그인된 사용자: API 사용
          await notesAPI.updateNote(pageId, { content });
        } else {
          // 비로그인 사용자: 로컬스토리지 사용
          localStorageAPI.updateNote(pageId, content);
        }
      } catch (error) {
        console.error("Failed to update note:", error);
        // API 실패 시 로컬스토리지로 폴백
        if (
          typeof window !== "undefined" &&
          localStorage.getItem("auth_token")
        ) {
          localStorageAPI.updateNote(pageId, content);
        }
      } finally {
        debounceTimers.current.delete(pageId);
      }
    }, 500);

    debounceTimers.current.set(pageId, timer);
  }, []);

  const tearPageLocally = useCallback(
    (pageId: string, pageToTear: Page) => {
      const newTornPage = {
        id: uid(),
        content: pageToTear.content,
        x: 40 + Math.random() * 120,
        y: 40 + Math.random() * 80,
      };

      // 원본에서 제거
      setPages((prev) => prev.filter((p) => p.id !== pageId));

      // 찢어진 페이지에 추가
      setLoosePages((prev) => {
        const updatedLoose = [...prev, newTornPage];
        const updatedPages = pages.filter((p) => p.id !== pageId);
        localStorageAPI.saveNotes(updatedPages);
        localStorageAPI.saveTornNotes(updatedLoose);
        return updatedLoose;
      });
    },
    [pages],
  );

  // 찢기: 노트 → 페이지 리스트로 이동
  const tearPage = useCallback(
    async (pageId: string) => {
      const pageToTear = pages.find((p) => p.id === pageId);
      if (!pageToTear) return;

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      if (token) {
        // 로그인된 사용자: API 사용
        try {
          await notesAPI.tearNote(pageId);
          // API 호출 후 데이터 다시 로딩
          const [notesData, tornData] = await Promise.all([
            notesAPI.getNotes(),
            notesAPI.getTornNotes(),
          ]);
          setPages(notesData || []);
          setLoosePages(ensurePositions(tornData || []));
        } catch (error) {
          console.error("Failed to tear note via API:", error);
          // API 실패 시 로컬스토리지로 폴백
          tearPageLocally(pageId, pageToTear);
        }
      } else {
        // 비로그인 사용자: 로컬스토리지 사용
        tearPageLocally(pageId, pageToTear);
      }
    },
    [pages, ensurePositions, tearPageLocally],
  );

  const discardFromListLocally = useCallback(
    (pid: string, pageToDiscard: PositionedPage) => {
      const newTrashPage = { ...pageToDiscard, x: 60, y: 60 };

      // loose pages에서 제거
      setLoosePages((prev) => prev.filter((p) => p.id !== pid));

      // trash에 추가
      setTrashPages((prev) => {
        const updatedTrash = [...prev, newTrashPage];
        const updatedLoose = loosePages.filter((p) => p.id !== pid);
        localStorageAPI.saveTornNotes(updatedLoose);
        localStorageAPI.saveTrashedNotes(updatedTrash);
        return updatedTrash;
      });
    },
    [loosePages],
  );

  // 페이지 리스트 → 휴지통
  const discardFromList = useCallback(
    async (pid: string) => {
      const pageToDiscard = loosePages.find((p) => p.id === pid);
      if (!pageToDiscard) return;

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      if (token) {
        // 로그인된 사용자: API 사용
        try {
          await notesAPI.moveToTrash(pid);
          // API 호출 후 데이터 다시 로딩
          const [tornData, trashedData] = await Promise.all([
            notesAPI.getTornNotes(),
            notesAPI.getTrashedNotes(),
          ]);
          setLoosePages(ensurePositions(tornData || []));
          setTrashPages(ensurePositions(trashedData || []));
        } catch (error) {
          console.error("Failed to move to trash via API:", error);
          // API 실패 시 로컬스토리지로 폴백
          discardFromListLocally(pid, pageToDiscard);
        }
      } else {
        // 비로그인 사용자: 로컬스토리지 사용
        discardFromListLocally(pid, pageToDiscard);
      }
    },
    [loosePages, ensurePositions, discardFromListLocally],
  );

  const restoreToListLocally = useCallback(
    (pid: string, pageToRestore: PositionedPage) => {
      const restoredPage = {
        id: pageToRestore.id,
        content: pageToRestore.content,
        x: 40 + Math.random() * 120,
        y: 40 + Math.random() * 80,
      };

      // 휴지통에서 제거
      setTrashPages((prev) => prev.filter((p) => p.id !== pid));

      // 찢은 페이지 리스트에 추가
      setLoosePages((prev) => {
        const updatedLoose = [...prev, restoredPage];
        const updatedTrash = trashPages.filter((p) => p.id !== pid);
        localStorageAPI.saveTornNotes(updatedLoose);
        localStorageAPI.saveTrashedNotes(updatedTrash);
        return updatedLoose;
      });
    },
    [trashPages],
  );

  // 휴지통에서 리스트로 복원
  const restoreToList = useCallback(
    async (pid: string) => {
      const pageToRestore = trashPages.find((p) => p.id === pid);
      if (!pageToRestore) return;

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      if (token) {
        // 로그인된 사용자: API 사용
        try {
          await notesAPI.restoreFromTrash(pid);
          // API 호출 후 데이터 다시 로딩
          const [tornData, trashedData] = await Promise.all([
            notesAPI.getTornNotes(),
            notesAPI.getTrashedNotes(),
          ]);
          setLoosePages(ensurePositions(tornData || []));
          setTrashPages(ensurePositions(trashedData || []));
        } catch (error) {
          console.error("Failed to restore from trash via API:", error);
          // API 실패 시 로컬스토리지로 폴백
          restoreToListLocally(pid, pageToRestore);
        }
      } else {
        // 비로그인 사용자: 로컬스토리지 사용
        restoreToListLocally(pid, pageToRestore);
      }
    },
    [trashPages, ensurePositions, restoreToListLocally],
  );

  const deleteForeverLocally = useCallback((pid: string) => {
    setTrashPages((prev) => {
      const updatedTrash = prev.filter((p) => p.id !== pid);
      localStorageAPI.saveTrashedNotes(updatedTrash);
      return updatedTrash;
    });
  }, []);

  // 휴지통 완전 삭제
  const deleteForever = useCallback(
    async (pid: string) => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      if (token) {
        // 로그인된 사용자: API 사용
        try {
          await notesAPI.deleteNote(pid);
          // API 호출 후 데이터 다시 로딩
          const trashedData = await notesAPI.getTrashedNotes();
          setTrashPages(ensurePositions(trashedData || []));
        } catch (error) {
          console.error("Failed to delete note via API:", error);
          // API 실패 시 로컬스토리지로 폴백
          deleteForeverLocally(pid);
        }
      } else {
        // 비로그인 사용자: 로컬스토리지 사용
        deleteForeverLocally(pid);
      }
    },
    [ensurePositions, deleteForeverLocally],
  );

  const updatePagePositionLocally = useCallback(
    (id: string, x: number, y: number) => {
      const loosePages = localStorageAPI.getTornNotes();
      const trashPages = localStorageAPI.getTrashedNotes();

      const updatedLoose = loosePages.map((p: PositionedPage) =>
        p.id === id ? { ...p, x, y } : p,
      );
      const updatedTrash = trashPages.map((p: PositionedPage) =>
        p.id === id ? { ...p, x, y } : p,
      );

      localStorageAPI.saveTornNotes(updatedLoose);
      localStorageAPI.saveTrashedNotes(updatedTrash);
    },
    [],
  );

  // 페이지 위치 업데이트 (드래그용)
  const updatePagePosition = useCallback(
    (id: string, x: number, y: number) => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      // 로컬 상태 즉시 업데이트
      setLoosePages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, x, y } : p)),
      );
      setTrashPages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, x, y } : p)),
      );

      // 기존 타이머 제거
      const existingTimer = debounceTimers.current.get(`position_${id}`);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // 새로운 debounced 업데이트
      const timer = setTimeout(async () => {
        if (token) {
          // 로그인된 사용자: API로 좌표 저장
          try {
            await notesAPI.updateNotePosition(id, x, y);
          } catch (error) {
            console.error("Failed to update position via API:", error);
            // API 실패 시 로컬스토리지로 폴백
            updatePagePositionLocally(id, x, y);
          }
        } else {
          // 비로그인 사용자: 로컬스토리지에 저장
          updatePagePositionLocally(id, x, y);
        }
        debounceTimers.current.delete(`position_${id}`);
      }, 300); // 300ms 디바운스

      debounceTimers.current.set(`position_${id}`, timer);
    },
    [updatePagePositionLocally],
  );

  // 100개로 채우기 (부족한 만큼 추가)
  const add100Notes = useCallback(async () => {
    const currentCount = pages.length;
    const needed = Math.max(0, 100 - currentCount);

    if (needed > 0) {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      if (token) {
        // 로그인된 사용자: API 사용
        try {
          await notesAPI.create100Notes();
          // API 호출 후 데이터 다시 로딩
          const notesData = await notesAPI.getNotes();
          setPages(notesData || []);
        } catch (error) {
          console.error("Failed to create 100 notes via API:", error);
          // API 실패 시 로컬스토리지로 폴백
          const newPages = Array.from({ length: needed }, () => ({
            id: uid(),
            content: "",
          }));
          const updatedPages = [...pages, ...newPages];
          setPages(updatedPages);
          localStorageAPI.saveNotes(updatedPages);
        }
      } else {
        // 비로그인 사용자: 로컬스토리지에 저장
        const newPages = Array.from({ length: needed }, () => ({
          id: uid(),
          content: "",
        }));
        const updatedPages = [...pages, ...newPages];
        setPages(updatedPages);
        localStorageAPI.saveNotes(updatedPages);
      }
    }
  }, [pages]);

  return {
    pages,
    loosePages,
    trashPages,
    loading,
    updateContent,
    tearPage,
    discardFromList,
    restoreToList,
    deleteForever,
    updatePagePosition,
    add100Notes,
  };
}
