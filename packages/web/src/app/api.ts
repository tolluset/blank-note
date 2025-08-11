import type { Page, PositionedPage } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'

export class NotesAPI {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken()

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  async getNotes(): Promise<Page[]> {
    return this.request<Page[]>('/notes')
  }

  async getTornNotes(): Promise<PositionedPage[]> {
    return this.request<PositionedPage[]>('/notes/torn')
  }

  async getTrashedNotes(): Promise<PositionedPage[]> {
    return this.request<PositionedPage[]>('/notes/trashed')
  }

  async updateNote(pageId: string, data: Partial<Page>) {
    return this.request(`/notes/${pageId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async create100Notes() {
    return this.request('/notes/create-100', {
      method: 'POST',
    })
  }

  async tearNote(pageId: string) {
    return this.request(`/notes/${pageId}/tear`, {
      method: 'POST',
    })
  }

  async moveToTrash(pageId: string) {
    return this.request(`/notes/${pageId}/trash`, {
      method: 'POST',
    })
  }

  async restoreFromTrash(pageId: string) {
    return this.request(`/notes/${pageId}/restore`, {
      method: 'POST',
    })
  }

  async deleteNote(pageId: string) {
    return this.request(`/notes/${pageId}`, {
      method: 'DELETE',
    })
  }

  async updateNotePosition(pageId: string, x: number, y: number) {
    return this.request(`/notes/${pageId}/position`, {
      method: 'PATCH',
      body: JSON.stringify({ x, y }),
    })
  }
}

export class AuthAPI {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken()

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  async googleLogin(idToken: string): Promise<{ token: string }> {
    return this.request<{ token: string }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    })
  }

  isLoggedIn(): boolean {
    return !!this.getAuthToken()
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  async getMe(): Promise<{ id: string; email: string; name?: string; avatar?: string }> {
    return this.request<{ id: string; email: string; name?: string; avatar?: string }>('/auth/me')
  }
}

export const authAPI = new AuthAPI()
export const notesAPI = new NotesAPI()
