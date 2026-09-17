export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'member';
export type UserStatus = 'active' | 'suspended' | 'blocked';
export type BookStatus = 'active' | 'inactive';
export type RequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'cancelled'
  | 'not_picked_up'
  | 'completed';
export type RequestItemStatus = 'pending' | 'approved' | 'rejected';
export type PassStatus = 'active' | 'used' | 'expired' | 'cancelled';
export type LoanStatus = 'active' | 'completed' | 'overdue';
export type LoanItemStatus =
  | 'borrowed'
  | 'returned'
  | 'overdue'
  | 'lost'
  | 'damaged';
export type DamageLevel = 'none' | 'minor' | 'major' | 'lost';
export type ExtensionStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'auto_approved';
export type WaitlistStatus =
  | 'waiting'
  | 'notified'
  | 'fulfilled'
  | 'cancelled';
export type FineType = 'overdue' | 'damage_minor' | 'damage_major' | 'lost';
export type FineStatus = 'unpaid' | 'paid';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          phone: string | null;
          member_number: string;
          status: UserStatus;
          no_show_count: number;
          suspended_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name: string;
          phone?: string | null;
          member_number: string;
          status?: UserStatus;
          no_show_count?: number;
          suspended_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          phone?: string | null;
          member_number?: string;
          status?: UserStatus;
          no_show_count?: number;
          suspended_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      books: {
        Row: {
          id: string;
          title: string;
          author: string;
          isbn: string;
          category_id: string;
          publisher: string | null;
          published_year: number | null;
          description: string | null;
          cover_url: string | null;
          price: number;
          total_stock: number;
          available_stock: number;
          status: BookStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          author: string;
          isbn: string;
          category_id: string;
          publisher?: string | null;
          published_year?: number | null;
          description?: string | null;
          cover_url?: string | null;
          price?: number;
          total_stock?: number;
          available_stock?: number;
          status?: BookStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          author?: string;
          isbn?: string;
          category_id?: string;
          publisher?: string | null;
          published_year?: number | null;
          description?: string | null;
          cover_url?: string | null;
          price?: number;
          total_stock?: number;
          available_stock?: number;
          status?: BookStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      loan_requests: {
        Row: {
          id: string;
          request_number: string;
          user_id: string;
          status: RequestStatus;
          admin_id: string | null;
          admin_notes: string | null;
          requested_at: string;
          processed_at: string | null;
          expires_at: string;
          pickup_deadline: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_number?: string;
          user_id: string;
          status?: RequestStatus;
          admin_id?: string | null;
          admin_notes?: string | null;
          requested_at?: string;
          processed_at?: string | null;
          expires_at: string;
          pickup_deadline?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_number?: string;
          user_id?: string;
          status?: RequestStatus;
          admin_id?: string | null;
          admin_notes?: string | null;
          requested_at?: string;
          processed_at?: string | null;
          expires_at?: string;
          pickup_deadline?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      loan_request_items: {
        Row: {
          id: string;
          request_id: string;
          book_id: string;
          status: RequestItemStatus;
          rejection_reason: string | null;
        };
        Insert: {
          id?: string;
          request_id: string;
          book_id: string;
          status?: RequestItemStatus;
          rejection_reason?: string | null;
        };
        Update: {
          id?: string;
          request_id?: string;
          book_id?: string;
          status?: RequestItemStatus;
          rejection_reason?: string | null;
        };
        Relationships: [];
      };
      pickup_passes: {
        Row: {
          id: string;
          request_id: string;
          pickup_code: string;
          status: PassStatus;
          expires_at: string;
          used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          pickup_code: string;
          status?: PassStatus;
          expires_at: string;
          used_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          pickup_code?: string;
          status?: PassStatus;
          expires_at?: string;
          used_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      loans: {
        Row: {
          id: string;
          request_id: string;
          user_id: string;
          pickup_confirmed_at: string;
          status: LoanStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          user_id: string;
          pickup_confirmed_at?: string;
          status?: LoanStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          user_id?: string;
          pickup_confirmed_at?: string;
          status?: LoanStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      loan_items: {
        Row: {
          id: string;
          loan_id: string;
          book_id: string;
          due_date: string;
          status: LoanItemStatus;
          extension_count: number;
          returned_at: string | null;
          damage_level: DamageLevel;
          replacement_cost: number;
          admin_notes: string | null;
        };
        Insert: {
          id?: string;
          loan_id: string;
          book_id: string;
          due_date: string;
          status?: LoanItemStatus;
          extension_count?: number;
          returned_at?: string | null;
          damage_level?: DamageLevel;
          replacement_cost?: number;
          admin_notes?: string | null;
        };
        Update: {
          id?: string;
          loan_id?: string;
          book_id?: string;
          due_date?: string;
          status?: LoanItemStatus;
          extension_count?: number;
          returned_at?: string | null;
          damage_level?: DamageLevel;
          replacement_cost?: number;
          admin_notes?: string | null;
        };
        Relationships: [];
      };
      loan_extensions: {
        Row: {
          id: string;
          loan_item_id: string;
          user_id: string;
          status: ExtensionStatus;
          old_due_date: string;
          new_due_date: string;
          admin_id: string | null;
          requested_at: string;
          processed_at: string | null;
        };
        Insert: {
          id?: string;
          loan_item_id: string;
          user_id: string;
          status?: ExtensionStatus;
          old_due_date: string;
          new_due_date: string;
          admin_id?: string | null;
          requested_at?: string;
          processed_at?: string | null;
        };
        Update: {
          id?: string;
          loan_item_id?: string;
          user_id?: string;
          status?: ExtensionStatus;
          old_due_date?: string;
          new_due_date?: string;
          admin_id?: string | null;
          requested_at?: string;
          processed_at?: string | null;
        };
        Relationships: [];
      };
      waitlist: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          status: WaitlistStatus;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          status?: WaitlistStatus;
          position: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          status?: WaitlistStatus;
          position?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      fines: {
        Row: {
          id: string;
          loan_item_id: string;
          user_id: string;
          type: FineType;
          amount: number;
          status: FineStatus;
          days_overdue: number;
          paid_at: string | null;
          confirmed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          loan_item_id: string;
          user_id: string;
          type: FineType;
          amount: number;
          status?: FineStatus;
          days_overdue?: number;
          paid_at?: string | null;
          confirmed_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          loan_item_id?: string;
          user_id?: string;
          type?: FineType;
          amount?: number;
          status?: FineStatus;
          days_overdue?: number;
          paid_at?: string | null;
          confirmed_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          is_read: boolean;
          related_id: string | null;
          related_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          is_read?: boolean;
          related_id?: string | null;
          related_type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          is_read?: boolean;
          related_id?: string | null;
          related_type?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      approve_loan_request: {
        Args: {
          p_request_id: string;
          p_admin_id: string | null;
          p_approved_book_ids: string[];
          p_pickup_deadline: string;
          p_pickup_code: string;
        };
        Returns: boolean;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      book_status: BookStatus;
      damage_level: DamageLevel;
      extension_status: ExtensionStatus;
      fine_status: FineStatus;
      fine_type: FineType;
      loan_item_status: LoanItemStatus;
      loan_status: LoanStatus;
      pass_status: PassStatus;
      request_item_status: RequestItemStatus;
      request_status: RequestStatus;
      user_role: UserRole;
      user_status: UserStatus;
      waitlist_status: WaitlistStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
