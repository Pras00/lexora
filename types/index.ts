import { Database } from './database.types';

export * from './database.types';

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Profile = Tables<'profiles'>;
export type Book = Tables<'books'>;
export type Category = Tables<'categories'>;
export type LoanRequest = Tables<'loan_requests'>;
export type LoanRequestItem = Tables<'loan_request_items'>;
export type PickupPass = Tables<'pickup_passes'>;
export type Loan = Tables<'loans'>;
export type LoanItem = Tables<'loan_items'>;
export type Fine = Tables<'fines'>;
export type Notification = Tables<'notifications'>;

// Extended types for UI views with relations
export type BookWithCategory = Book & {
  category: Category;
};

export type CartItem = {
  book: Book;
  addedAt: string;
};

export type LoanItemWithBook = LoanItem & {
  book: Book;
};

export type LoanWithDetails = Loan & {
  user: Profile;
  items: LoanItemWithBook[];
};

export type RequestItemWithBook = LoanRequestItem & {
  book: Book;
};

export type LoanRequestWithDetails = LoanRequest & {
  user: Profile;
  items: RequestItemWithBook[];
  pass?: PickupPass | null;
};
