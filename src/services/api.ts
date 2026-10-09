import {
  User,
  StudentProfile,
  Scholarship,
  Application,
  DashboardData,
  EligibilityResult,
  DbStatus
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('scholarsphere_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('scholarsphere_token', token);
    } else {
      localStorage.removeItem('scholarsphere_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({ success: false, message: 'Invalid response from server' }));

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data as T;
    } catch (error: any) {
      console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error.message);
      throw error;
    }
  }

  // --- Health ---
  public async getHealth(): Promise<{ status: string; database: DbStatus }> {
    return this.request('/health');
  }

  // --- Auth ---
  public async register(payload: { name: string; email: string; password: string; role?: string }) {
    const res = await this.request<{ success: boolean; token: string; user: User; profile: StudentProfile }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify(payload) }
    );
    this.setToken(res.token);
    return res;
  }

  public async login(payload: { email: string; password: string }) {
    const res = await this.request<{ success: boolean; token: string; user: User; profile: StudentProfile }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify(payload) }
    );
    this.setToken(res.token);
    return res;
  }

  public async getMe() {
    return this.request<{ success: boolean; user: User; profile: StudentProfile }>('/auth/me');
  }

  public async demoLogin(scenario: 'alex_stem' | 'maya_incomplete' | 'david_humanities' | 'admin_eleanor') {
    const res = await this.request<{
      success: boolean;
      token: string;
      user: User;
      profile: StudentProfile;
      scenarioDescription: string;
    }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ scenario })
    });
    this.setToken(res.token);
    return res;
  }

  // --- Profile ---
  public async getProfile() {
    return this.request<{ success: boolean; profile: StudentProfile }>('/profile');
  }

  public async updateProfile(profileData: Partial<StudentProfile>) {
    return this.request<{ success: boolean; message: string; profile: StudentProfile }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // --- Scholarships ---
  public async getScholarships(params: {
    q?: string;
    educationLevel?: string;
    course?: string;
    category?: string;
    reservationCategory?: string;
    verificationStatus?: string;
    lifecycleStatus?: string;
    minFunding?: number;
    maxIncome?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.educationLevel && params.educationLevel !== 'all') query.append('educationLevel', params.educationLevel);
    if (params.course && params.course !== 'all') query.append('course', params.course);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.reservationCategory && params.reservationCategory !== 'all') query.append('reservationCategory', params.reservationCategory);
    if (params.verificationStatus && params.verificationStatus !== 'all') query.append('verificationStatus', params.verificationStatus);
    if (params.lifecycleStatus) query.append('lifecycleStatus', params.lifecycleStatus);
    if (params.minFunding) query.append('minFunding', params.minFunding.toString());
    if (params.maxIncome) query.append('maxIncome', params.maxIncome.toString());
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<{
      success: boolean;
      scholarships: Scholarship[];
      totalCount: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/scholarships${qs}`);
  }

  public async getScholarshipById(id: string) {
    return this.request<{ success: boolean; scholarship: Scholarship }>(`/scholarships/${id}`);
  }

  public async createScholarship(scholarship: Partial<Scholarship>) {
    return this.request<{ success: boolean; scholarship: Scholarship }>('/scholarships', {
      method: 'POST',
      body: JSON.stringify(scholarship)
    });
  }

  public async updateScholarship(id: string, updates: Partial<Scholarship>) {
    return this.request<{ success: boolean; scholarship: Scholarship }>(`/scholarships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  public async deleteScholarship(id: string) {
    return this.request<{ success: boolean; message: string }>(`/scholarships/${id}`, {
      method: 'DELETE'
    });
  }

  // --- Eligibility ---
  public async evaluateEligibility(scholarshipId: string) {
    return this.request<{ success: boolean; evaluation: EligibilityResult }>(`/eligibility/${scholarshipId}`);
  }

  // --- Saved ---
  public async getSavedScholarships() {
    return this.request<{ success: boolean; saved: Scholarship[] }>('/saved');
  }

  public async saveScholarship(scholarshipId: string) {
    return this.request<{ success: boolean; message: string }>(`/saved/${scholarshipId}`, {
      method: 'POST'
    });
  }

  public async removeSavedScholarship(scholarshipId: string) {
    return this.request<{ success: boolean; message: string }>(`/saved/${scholarshipId}`, {
      method: 'DELETE'
    });
  }

  // --- Applications Tracker ---
  public async getApplications() {
    return this.request<{ success: boolean; applications: Application[] }>('/applications');
  }

  public async createApplication(scholarshipId: string, trackerStatus: string = 'interested', notes: string = '') {
    return this.request<{ success: boolean; application: Application }>('/applications', {
      method: 'POST',
      body: JSON.stringify({ scholarshipId, trackerStatus, notes })
    });
  }

  public async updateApplication(
    id: string,
    updates: { trackerStatus?: string; notes?: string; appliedDate?: string; checklistProgress?: any[] }
  ) {
    return this.request<{ success: boolean; application: Application }>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  public async updateDocumentChecklist(scholarshipId: string, documentName: string, isReady: boolean, notes?: string) {
    return this.request<{ success: boolean; application: Application }>(
      `/applications/${scholarshipId}/checklist`,
      {
        method: 'PUT',
        body: JSON.stringify({ documentName, isReady, notes })
      }
    );
  }

  public async deleteApplication(scholarshipId: string) {
    return this.request<{ success: boolean; message: string }>(`/applications/${scholarshipId}`, {
      method: 'DELETE'
    });
  }

  // --- Dashboard ---
  public async getDashboard() {
    return this.request<{ success: boolean } & DashboardData>('/dashboard');
  }

  // --- Guidance Assistant ---
  public async askAssistant(question: string, scholarshipId?: string) {
    return this.request<{
      success: boolean;
      mode: string;
      modelProvider: string;
      answer: string;
      contextScholarship?: string;
    }>('/assistant/ask', {
      method: 'POST',
      body: JSON.stringify({ question, scholarshipId })
    });
  }

  // --- Admin Demo Reset ---
  public async resetDemoData() {
    return this.request<{ success: boolean; message: string }>('/admin/reset-demo', {
      method: 'POST'
    });
  }
}

export const api = new ApiClient();
