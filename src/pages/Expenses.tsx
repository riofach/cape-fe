
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Calendar as CalendarIcon, 
  CreditCard, 
  Download, 
  Pencil, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Trash2 
} from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock expense data
const mockExpenses = [
  {
    id: 1,
    description: "Grocery shopping",
    amount: 120.50,
    date: "2025-04-12",
    category: "Food"
  },
  {
    id: 2,
    description: "Monthly rent",
    amount: 850.00,
    date: "2025-04-01",
    category: "Housing"
  },
  {
    id: 3,
    description: "Electricity bill",
    amount: 75.20,
    date: "2025-04-05",
    category: "Utilities"
  },
  {
    id: 4,
    description: "Restaurant dinner",
    amount: 65.30,
    date: "2025-04-10",
    category: "Food"
  },
  {
    id: 5,
    description: "Movie tickets",
    amount: 32.00,
    date: "2025-04-08",
    category: "Entertainment"
  },
  {
    id: 6,
    description: "Mobile phone bill",
    amount: 45.99,
    date: "2025-04-15",
    category: "Utilities"
  },
  {
    id: 7,
    description: "Fuel",
    amount: 48.75,
    date: "2025-04-07",
    category: "Transportation"
  },
  {
    id: 8,
    description: "Gym membership",
    amount: 35.00,
    date: "2025-04-01",
    category: "Health & Fitness"
  },
  {
    id: 9,
    description: "Online course",
    amount: 199.99,
    date: "2025-04-20",
    category: "Education"
  },
  {
    id: 10,
    description: "Coffee shop",
    amount: 12.40,
    date: "2025-04-13",
    category: "Food"
  }
];

// Available categories
const categories = [
  "Food",
  "Housing",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Health & Fitness",
  "Education",
  "Shopping",
  "Personal Care",
  "Travel",
  "Gifts & Donations",
  "Other"
];

const Expenses = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);
  
  // Edit expense state
  const [editExpenseOpen, setEditExpenseOpen] = useState(false);
  const [editExpense, setEditExpense] = useState({
    id: 0,
    description: "",
    amount: 0,
    date: "",
    category: ""
  });

  // Add expense state
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: 0,
    date: format(new Date(), "yyyy-MM-dd"),
    category: "Food"
  });

  // Filter expenses based on search term and filters
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || expense.category === categoryFilter;
    
    let matchesDateRange = true;
    if (startDate) {
      const expenseDate = new Date(expense.date);
      if (expenseDate < startDate) {
        matchesDateRange = false;
      }
    }
    if (endDate) {
      const expenseDate = new Date(expense.date);
      if (expenseDate > endDate) {
        matchesDateRange = false;
      }
    }
    
    return matchesSearch && matchesCategory && matchesDateRange;
  });

  // Handle editing an expense
  const handleEditExpense = (expense: typeof editExpense) => {
    setEditExpense(expense);
    setEditExpenseOpen(true);
  };

  // Save edited expense
  const saveEditedExpense = () => {
    setExpenses(expenses.map(expense => 
      expense.id === editExpense.id ? editExpense : expense
    ));
    setEditExpenseOpen(false);
  };

  // Handle adding a new expense
  const saveNewExpense = () => {
    const expense = {
      ...newExpense,
      id: Math.max(...expenses.map(e => e.id)) + 1,
    };
    setExpenses([expense, ...expenses]);
    setAddExpenseOpen(false);
    setNewExpense({
      description: "",
      amount: 0,
      date: format(new Date(), "yyyy-MM-dd"),
      category: "Food"
    });
  };

  // Handle deleting an expense
  const handleDeleteExpense = (id: number) => {
    setSelectedExpenseId(id);
    setDeleteAlertOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedExpenseId) {
      setExpenses(expenses.filter(expense => expense.id !== selectedExpenseId));
    }
    setDeleteAlertOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    setCategoryFilter("");
    setStartDate(undefined);
    setEndDate(undefined);
    setIsFilterOpen(false);
  };

  return (
    <DashboardLayout>
      {/* Page Title and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Expenses</h1>
          <p className="text-gray-600">Manage and track your expenses</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            onClick={() => setAddExpenseOpen(true)}
            className="bg-primary-gradient hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search expenses..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filter
                {(categoryFilter || startDate || endDate) && (
                  <span className="ml-2 w-2 h-2 rounded-full bg-primary"></span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Expenses</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label 
                        htmlFor="start-date" 
                        className="text-xs text-gray-500"
                      >
                        From
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            id="start-date"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? (
                              format(startDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex-1">
                      <Label 
                        htmlFor="end-date" 
                        className="text-xs text-gray-500"
                      >
                        To
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            id="end-date"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? (
                              format(endDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>
            Expenses List
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredExpenses.length} items)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.description}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {expense.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${expense.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditExpense(expense)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteExpense(expense.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      No expenses found. Try adjusting your filters or add a new expense.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Dialog */}
      <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Enter the details of your expense below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What was this expense for?"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newExpense.amount || ""}
                onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newExpense.date ? (
                        format(new Date(newExpense.date), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newExpense.date ? new Date(newExpense.date) : undefined}
                      onSelect={(date) => setNewExpense({
                        ...newExpense,
                        date: date ? format(date, "yyyy-MM-dd") : ""
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(value) => setNewExpense({...newExpense, category: value})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddExpenseOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveNewExpense}
              disabled={!newExpense.description || newExpense.amount <= 0 || !newExpense.date}
            >
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={editExpenseOpen} onOpenChange={setEditExpenseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Update the details of your expense.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="What was this expense for?"
                value={editExpense.description}
                onChange={(e) => setEditExpense({...editExpense, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount ($)</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={editExpense.amount || ""}
                onChange={(e) => setEditExpense({...editExpense, amount: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="edit-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editExpense.date ? (
                        format(new Date(editExpense.date), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editExpense.date ? new Date(editExpense.date) : undefined}
                      onSelect={(date) => setEditExpense({
                        ...editExpense,
                        date: date ? format(date, "yyyy-MM-dd") : ""
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editExpense.category}
                  onValueChange={(value) => setEditExpense({...editExpense, category: value})}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditExpenseOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveEditedExpense}
              disabled={!editExpense.description || editExpense.amount <= 0 || !editExpense.date}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this expense. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Expenses;
