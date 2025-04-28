import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search as SearchIcon, Mail, Star, MessageSquare } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const customers = [
  {
    id: "cust1",
    name: "John Doe",
    email: "john.doe@example.com",
    orders: 5,
    totalSpent: 8500,
    lastOrder: "2025-04-15",
    status: "Active",
  },
  {
    id: "cust2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    orders: 3,
    totalSpent: 6200,
    lastOrder: "2025-04-10",
    status: "Active",
  },
  {
    id: "cust3",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    orders: 8,
    totalSpent: 12500,
    lastOrder: "2025-04-18",
    status: "Active",
  },
  {
    id: "cust4",
    name: "Maria Garcia",
    email: "maria.g@example.com",
    orders: 2,
    totalSpent: 3500,
    lastOrder: "2025-04-05",
    status: "Inactive",
  },
  {
    id: "cust5",
    name: "David Williams",
    email: "david.w@example.com",
    orders: 6,
    totalSpent: 9800,
    lastOrder: "2025-04-17",
    status: "Active",
  },
];

const reviews = [
  {
    id: "rev1",
    productId: "prod1",
    productName: "Classic White Shirt",
    customerId: "cust1",
    customerName: "John Doe",
    rating: 5,
    comment: "Great quality shirt! The fabric is soft and comfortable. Fits perfectly as per the size chart.",
    date: "2025-04-16",
    reply: null,
  },
  {
    id: "rev2",
    productId: "prod3",
    productName: "Floral Summer Dress",
    customerId: "cust2",
    customerName: "Jane Smith",
    rating: 4,
    comment: "Beautiful dress, but the color is a bit different from what was shown in the picture.",
    date: "2025-04-12",
    reply: "Thank you for your feedback. We apologize for the color discrepancy and will work on improving our product images.",
  },
  {
    id: "rev3",
    productId: "prod2",
    productName: "Blue Denim Jeans",
    customerId: "cust3",
    customerName: "Robert Johnson",
    rating: 5,
    comment: "Perfect fit and great quality denim. Highly recommended!",
    date: "2025-04-18",
    reply: null,
  },
  {
    id: "rev4",
    productId: "prod4",
    productName: "Sports Running Shoes",
    customerId: "cust5",
    customerName: "David Williams",
    rating: 3,
    comment: "The shoes are comfortable but not as durable as I expected. Started showing signs of wear after just a few weeks.",
    date: "2025-04-15",
    reply: null,
  },
];

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState<typeof reviews[0] | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [reviewsList, setReviewsList] = useState(reviews);
  
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredReviews = reviewsList.filter((review) =>
    review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleOpenReplyDialog = (review: typeof reviews[0]) => {
    setSelectedReview(review);
    setReplyText(review.reply || "");
    setReplyDialogOpen(true);
  };
  
  const handleSubmitReply = () => {
    if (!selectedReview) return;
    
    const updatedReviews = reviewsList.map(review => 
      review.id === selectedReview.id
        ? { ...review, reply: replyText }
        : review
    );
    
    setReviewsList(updatedReviews);
    setReplyDialogOpen(false);
    
    toast({
      title: "Reply submitted",
      description: `A notification email has been sent to ${selectedReview.customerName}.`,
    });
  };
  
  return (
    <AdminLayout pageTitle="Customers">
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search customers, reviews or products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>
                Manage your customers and their information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell>₹{customer.totalSpent}</TableCell>
                      <TableCell>{customer.lastOrder}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            customer.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => 
                          toast({
                            title: "Email sent",
                            description: `A message has been sent to ${customer.name}.`
                          })
                        }>
                          <Mail size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredCustomers.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">No customers found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Product Reviews</CardTitle>
              <CardDescription>
                View and respond to customer reviews.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reply</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.productName}</TableCell>
                      <TableCell>{review.customerName}</TableCell>
                      <TableCell>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                      <TableCell>{review.date}</TableCell>
                      <TableCell>
                        <Button
                          variant={review.reply ? "outline" : "default"}
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleOpenReplyDialog(review)}
                        >
                          <MessageSquare size={14} />
                          {review.reply ? "View Reply" : "Reply"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredReviews.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">No reviews found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedReview?.reply ? "View/Edit Reply" : "Reply to Review"}</DialogTitle>
            <DialogDescription>
              {selectedReview ? (
                <div className="mt-2 space-y-2">
                  <div>
                    <p className="text-sm font-semibold">{selectedReview.productName}</p>
                    <div className="flex my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < (selectedReview.rating || 0) ? "text-amber-500 fill-amber-500" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <p className="text-sm italic">"{selectedReview.comment}"</p>
                    <p className="text-xs text-gray-500">By {selectedReview.customerName} on {selectedReview.date}</p>
                  </div>
                </div>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Write your reply to the customer..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReply} disabled={!replyText.trim()}>
              {selectedReview?.reply ? "Update Reply" : "Send Reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCustomers;
