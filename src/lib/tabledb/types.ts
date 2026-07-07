/**
 * TypeScript types for TableDB schemas
 * Generated from appwrite.config.json
 */

// ===========================
// Appwrite TablesDB Row Base
// All table row types must extend this to satisfy TablesDB.listRows<T extends Row>
// ===========================

export interface Row {
  $id: string
  $sequence: string
  $tableId: string
  $databaseId: string
  $createdAt: string
  $updatedAt: string
  $permissions: string[]
}

// ===========================
// PayDB Types
// ===========================

export interface PayDBUser extends Row {
  userId: string
  email: string
  username: string
  displayName: string
  profileImage?: string
  phoneNumber?: string
  kycStatus?: string
  kycLevel?: number
  twoFactorEnabled?: boolean
  isActive?: boolean
  country?: string
  timezone?: string
  preferredCurrency?: string
  createdAt: string
  updatedAt: string
  // Relationships
  paymentRequests?: string | string[]
  aPIKeys?: string | string[]
}

export interface PayDBToken extends Row {
  tokenId: string
  symbol: string
  name: string
  blockchain: string
  contractAddress?: string
  decimals: number
  logoUrl?: string
  isStablecoin?: boolean
  isActive?: boolean
  marketCap?: number
  currentPrice?: number
  priceChange24h?: number
  lastPriceUpdate?: string
  createdAt: string
}

export interface PayDBPaymentRequest extends Row {
  requestId: string
  fromUserId: string
  toUserId?: string
  toEmail?: string
  tokenId: string
  amount: string
  description?: string
  dueDate?: string
  status?: 'pending' | 'paid' | 'cancelled' | 'expired'
  paymentTxId?: string
  invoiceNumber?: string
  metadata?: string
  createdAt: string
  paidAt?: string
  // Relationships
  users?: string | string[]
}

export interface PayDBExchangeRate extends Row {
  rateId: string
  fromCurrency: string
  toCurrency: string
  rate: number
  source: string
  lastUpdated: string
  isActive?: boolean
}

export interface PayDBAPIKey extends Row {
  keyId: string
  userId: string
  keyName: string
  publicKey: string
  hashedSecret: string
  permissions: string
  isActive?: boolean
  lastUsed?: string
  expiresAt?: string
  createdAt: string
  // Relationships
  users?: string | string[]
}

export interface PayDBVirtualCard extends Row {
  cardId: string
  userId: string
  cardNumber: string
  expiry: string
  cvv: string
  cardType: string
  status: string
  linkedWalletId?: string
  createdAt?: string
  updatedAt?: string
}

export interface PayDBVirtualAccount extends Row {
  accountId: string
  userId: string
  accountNumber: string
  currency?: string
  balance?: number
  status?: string
  linkedWalletId?: string
  createdAt?: string
  updatedAt?: string
}

// ===========================
// ProfilesDB Types
// ===========================

export interface ProfilesDBProfile extends Row {
  userId: string
  name: string
  email: string
  bio?: string
  skills?: string[]
  location?: string
  portfolio?: string
  socialLinks?: Record<string, string>
  avatar?: string
  coverImage?: string
  hourlyRate?: number
  availability?: 'available' | 'busy' | 'unavailable'
  languages?: string[]
  timezone?: string
  joinedAt?: string
  lastActive?: string
  verificationStatus?: 'unverified' | 'pending' | 'verified'
  rating?: number
  reviewCount?: number
}

export interface ProfilesDBProfileVerification extends Row {
  profileId: string
  verificationType: string
  documentFileIds?: string[]
  status: string
  notes?: string
  submittedAt?: string
  reviewedAt?: string
  reviewedBy?: string
}

// ===========================
// CoreDB Types
// ===========================

export interface CoreDBSkill extends Row {
  name: string
  category?: string
  description?: string
}

export interface CoreDBCategory extends Row {
  name: string
  description?: string
  parentCategory?: string
  icon?: string
}

export interface CoreDBPlatformSettings extends Row {
  key: string
  value: string
  description?: string
  category?: string
  isPublic?: boolean
}

// ===========================
// Generic Row Type
// ===========================

export interface TableDBRow extends Row {
  [key: string]: any
}

// ===========================
// Query Response Types
// ===========================

export interface TableDBListResponse<T> {
  total: number
  rows: T[]
}

export interface TableDBResponse<T> {
  row: T
}

// ===========================
// Transaction Types
// ===========================

export interface TableDBTransaction {
  $id: string
  status: 'pending' | 'committed' | 'rolled_back'
  ttl: number
  createdAt: string
  expiresAt: string
}

export interface TableDBOperation {
  action: 'create' | 'update' | 'delete'
  databaseId: string
  tableId: string
  rowId: string
  data?: Record<string, any>
  permissions?: string[]
}

// ===========================
// Helper Types
// ===========================

export type CreateRowData<T> = Omit<T, '$id' | '$sequence' | '$tableId' | '$databaseId' | '$permissions' | '$createdAt' | '$updatedAt'>
export type UpdateRowData<T> = Partial<CreateRowData<T>>
