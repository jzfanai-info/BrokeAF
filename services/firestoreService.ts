import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  deleteDoc, 
  doc,
  updateDoc,
  onSnapshot,
  writeBatch
} from "firebase/firestore";
import { db } from "../firebase";
import { Transaction, FinancialPlan, Category, TransactionType } from "../types";
import { DEFAULT_CATEGORIES } from "../constants";

const DEMO_DELAY = 500; // Simulate network latency

// --- Local Storage Helpers for Demo Mode ---
const getLocalData = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setLocalData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
  // Dispatch event to update listeners
  window.dispatchEvent(new Event('storage-update'));
};

// Helper to handle Firestore Errors
const handleFirestoreError = (error: any, action: string) => {
  console.error(`Error ${action}:`, error);
  if (error.code === 'permission-denied') {
    alert("Database Permission Denied. \nPlease check your Firestore Security Rules in the Firebase Console.\nEnsure you allow read/write: if request.auth.uid == userId;");
  }
  throw error;
};

// --- Service Functions ---

export const addTransaction = async (userId: string, transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
  if (userId === 'DEMO_USER') {
    await new Promise(resolve => setTimeout(resolve, DEMO_DELAY));
    const transactions = getLocalData('demo_transactions');
    const newTx = {
      ...transaction,
      id: `demo_${Date.now()}`,
      createdAt: Date.now()
    };
    transactions.unshift(newTx);
    setLocalData('demo_transactions', transactions);
    return;
  }

  try {
    await addDoc(collection(db, "users", userId, "transactions"), {
      ...transaction,
      createdAt: Date.now()
    });
  } catch (error) {
    handleFirestoreError(error, "adding transaction");
  }
};

export const updateTransaction = async (userId: string, transactionId: string, updates: Partial<Transaction>) => {
  if (userId === 'DEMO_USER') {
    await new Promise(resolve => setTimeout(resolve, DEMO_DELAY));
    const transactions = getLocalData('demo_transactions');
    const index = transactions.findIndex((t: Transaction) => t.id === transactionId);
    
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates };
      setLocalData('demo_transactions', transactions);
    }
    return;
  }

  try {
    const docRef = doc(db, "users", userId, "transactions", transactionId);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, "updating transaction");
  }
};

export const deleteTransaction = async (userId: string, transactionId: string) => {
  console.log(`Deleting transaction ${transactionId} for user ${userId}`);
  if (userId === 'DEMO_USER') {
    const transactions = getLocalData('demo_transactions');
    const filtered = transactions.filter((t: any) => t.id !== transactionId);
    setLocalData('demo_transactions', filtered);
    return;
  }

  try {
    await deleteDoc(doc(db, "users", userId, "transactions", transactionId));
  } catch (error) {
    handleFirestoreError(error, "deleting transaction");
  }
};

export const subscribeToTransactions = (userId: string, callback: (data: Transaction[]) => void) => {
  if (userId === 'DEMO_USER') {
    const loadData = () => {
      const transactions = getLocalData('demo_transactions');
      // Sort by date desc
      transactions.sort((a: Transaction, b: Transaction) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      callback(transactions);
    };
    
    // Initial load
    loadData();

    // Listen for local updates
    const handleStorageUpdate = () => loadData();
    window.addEventListener('storage-update', handleStorageUpdate);
    
    // Seed data if empty
    const currentData = getLocalData('demo_transactions');
    if (currentData.length === 0) {
      const mockData = [
        { id: '1', userId: 'DEMO_USER', type: 'income', amount: 3500, category: 'Salary', date: new Date().toISOString().split('T')[0], notes: 'Monthly Paycheck', createdAt: Date.now() },
        { id: '2', userId: 'DEMO_USER', type: 'expense', amount: 1200, category: 'Housing', date: new Date().toISOString().split('T')[0], notes: 'Rent', createdAt: Date.now() },
        { id: '3', userId: 'DEMO_USER', type: 'expense', amount: 150, category: 'Food', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], notes: 'Groceries', createdAt: Date.now() },
      ];
      setLocalData('demo_transactions', mockData);
    }

    return () => window.removeEventListener('storage-update', handleStorageUpdate);
  }

  const q = query(
    collection(db, "users", userId, "transactions"),
    orderBy("date", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const transactions: Transaction[] = [];
    snapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() } as Transaction);
    });
    callback(transactions);
  }, (error) => {
    console.error("Snapshot error:", error);
    // Silent fail for snapshot to avoid spamming alerts, but log it
  });
};

// --- Financial Plan Management ---

export const addFinancialPlan = async (userId: string, plan: Omit<FinancialPlan, 'id' | 'createdAt'>) => {
  if (userId === 'DEMO_USER') {
    const plans = getLocalData('demo_plans');
    plans.push({ 
      ...plan, 
      id: `plan_${Date.now()}`,
      createdAt: Date.now() 
    });
    setLocalData('demo_plans', plans);
    return;
  }
  
  try {
    await addDoc(collection(db, "users", userId, "financial_plans"), {
      ...plan,
      createdAt: Date.now()
    });
  } catch (error) {
    handleFirestoreError(error, "adding financial plan");
  }
};

export const updateFinancialPlan = async (userId: string, planId: string, updates: Partial<FinancialPlan>) => {
  if (userId === 'DEMO_USER') {
    const plans = getLocalData('demo_plans');
    const index = plans.findIndex((p: FinancialPlan) => p.id === planId);
    if (index !== -1) {
      plans[index] = { ...plans[index], ...updates };
      setLocalData('demo_plans', plans);
    }
    return;
  }

  try {
    await updateDoc(doc(db, "users", userId, "financial_plans", planId), updates);
  } catch (error) {
    handleFirestoreError(error, "updating financial plan");
  }
};

export const deleteFinancialPlan = async (userId: string, planId: string) => {
  console.log(`Deleting plan ${planId} for user ${userId}`);
  if (userId === 'DEMO_USER') {
    const plans = getLocalData('demo_plans');
    const filtered = plans.filter((p: FinancialPlan) => p.id !== planId);
    setLocalData('demo_plans', filtered);
    return;
  }

  try {
    await deleteDoc(doc(db, "users", userId, "financial_plans", planId));
  } catch (error) {
    handleFirestoreError(error, "deleting financial plan");
  }
};

export const subscribeToPlans = (userId: string, callback: (data: FinancialPlan[]) => void) => {
  if (userId === 'DEMO_USER') {
    const loadData = () => {
      // Sort by creation desc
      const plans = getLocalData('demo_plans');
      plans.sort((a: FinancialPlan, b: FinancialPlan) => b.createdAt - a.createdAt);
      callback(plans);
    };
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('storage-update', handleStorageUpdate);
    return () => window.removeEventListener('storage-update', handleStorageUpdate);
  }

  const q = query(
    collection(db, "users", userId, "financial_plans"), 
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const plans: FinancialPlan[] = [];
    snapshot.forEach((doc) => {
      plans.push({ id: doc.id, ...doc.data() } as FinancialPlan);
    });
    callback(plans);
  });
};

// --- Category Management ---

const seedDefaultCategories = async (userId: string) => {
  try {
    const batch = writeBatch(db);
    const colRef = collection(db, "users", userId, "categories");

    // Add NA category
    const naDoc = doc(colRef);
    batch.set(naDoc, { name: 'NA', type: 'expense', isSystem: true }); // Type doesn't matter much for NA, but required
    
    DEFAULT_CATEGORIES.income.forEach(name => {
      const ref = doc(colRef);
      batch.set(ref, { name, type: 'income', isSystem: false });
    });

    DEFAULT_CATEGORIES.expense.forEach(name => {
      const ref = doc(colRef);
      batch.set(ref, { name, type: 'expense', isSystem: false });
    });

    await batch.commit();
  } catch (error) {
    console.error("Error seeding categories:", error);
    // Don't throw here, allowing app to partially function, but permissions likely the cause
  }
};

export const subscribeToCategories = (userId: string, callback: (data: Category[]) => void) => {
  if (userId === 'DEMO_USER') {
    const loadData = () => {
      let cats = getLocalData('demo_categories');
      if (cats.length === 0) {
        // Seed demo
        cats.push({ id: 'na', name: 'NA', type: 'expense', isSystem: true });
        DEFAULT_CATEGORIES.income.forEach((name, i) => cats.push({ id: `inc_${i}`, name, type: 'income' }));
        DEFAULT_CATEGORIES.expense.forEach((name, i) => cats.push({ id: `exp_${i}`, name, type: 'expense' }));
        setLocalData('demo_categories', cats);
      }
      callback(cats);
    };
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('storage-update', handleStorageUpdate);
    return () => window.removeEventListener('storage-update', handleStorageUpdate);
  }

  const q = query(collection(db, "users", userId, "categories"), orderBy("name"));
  return onSnapshot(q, async (snapshot) => {
    if (snapshot.empty) {
      // Auto-seed if empty
      await seedDefaultCategories(userId);
      return;
    }
    const categories: Category[] = [];
    snapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() } as Category);
    });
    callback(categories);
  });
};

export const addCategory = async (userId: string, category: Omit<Category, 'id'>) => {
  if (userId === 'DEMO_USER') {
    const cats = getLocalData('demo_categories');
    cats.push({ ...category, id: `cat_${Date.now()}` });
    setLocalData('demo_categories', cats);
    return;
  }
  try {
    await addDoc(collection(db, "users", userId, "categories"), category);
  } catch (error) {
    handleFirestoreError(error, "adding category");
  }
};

export const deleteCategory = async (userId: string, categoryId: string, categoryName: string) => {
  if (categoryName === 'NA') return; // Should not happen, but safeguard

  if (userId === 'DEMO_USER') {
    // 1. Delete Category
    let cats = getLocalData('demo_categories');
    cats = cats.filter((c: Category) => c.id !== categoryId);
    setLocalData('demo_categories', cats);

    // 2. Update Transactions
    const txs = getLocalData('demo_transactions');
    let updated = false;
    const newTxs = txs.map((t: Transaction) => {
      if (t.category === categoryName) {
        updated = true;
        return { ...t, category: 'NA' };
      }
      return t;
    });

    if (updated) {
      setLocalData('demo_transactions', newTxs);
    }
    return;
  }

  try {
    // Firestore Atomic Batch
    const batch = writeBatch(db);

    // 1. Delete Category Doc
    const catRef = doc(db, "users", userId, "categories", categoryId);
    batch.delete(catRef);

    // 2. Find transactions with this category and update to NA
    const q = query(collection(db, "users", userId, "transactions"), where("category", "==", categoryName));
    const snapshot = await getDocs(q);
    
    snapshot.forEach((doc) => {
      batch.update(doc.ref, { category: 'NA' });
    });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, "deleting category");
  }
};