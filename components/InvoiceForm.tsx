// // components/InvoiceForm.tsx


// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { useSession } from 'next-auth/react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import { Switch } from '@/components/ui/switch';
// import { Label } from '@/components/ui/label';
// import { Trash2, Plus, Loader2, Mail, Send, AlertTriangle, Crown, Zap, Star, Users } from 'lucide-react';

// import { getPlanFeatures, checkInvoiceLimit, canUserPerform } from '@/lib/plan-utils';
// import BulkInvoiceSender from '@/components/BulkInvoiceSender'


// type InvoiceItem = {
//   desc: string;
//   qty: number;
//   price: number;
// };

// interface FormData {
//   businessName: string;
//   businessEmail: string;
//   businessPhone: string;
//   businessWebsite: string;
//   businessAddress: string;
//   clientName: string;
//   clientEmail: string;
//   clientAddress: string;
//   invoiceNo: string;
//   date: string;
//   dueDate: string;
//   notes: string;
//   signature: string;
//   vatEnabled: boolean;
//   businessRegNo: string;
//   businessTin: string;
// }

// interface UsageLimits {
//   canSendToClient: boolean;
//   dailyInvoicesLeft: number;
//   canUseTemplates: boolean;
//   canUseQR: boolean;
//   canBulkSend: boolean;
//   planName: string;
//   planIcon: any;
// }

// export default function InvoiceForm({ isFreeMode }: { isFreeMode?: boolean }) {
//   const { data: session } = useSession();
//   const userPlan = (session?.user as any)?.plan || 'free';
  
//   const [usageLimits, setUsageLimits] = useState<UsageLimits>({
//     canSendToClient: false,
//     dailyInvoicesLeft: 3,
//     canUseTemplates: false,
//     canUseQR: false,
//     canBulkSend: false,
//     planName: 'Free',
//     planIcon: Star
//   });

//   const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
//     defaultValues: {
//       businessName: '',
//       businessEmail: '',
//       businessPhone: '',
//       businessWebsite: '',
//       businessAddress: '',
//       clientName: '',
//       clientEmail: '',
//       clientAddress: '',
//       invoiceNo: 'INV-' + Date.now().toString().slice(-6),
//       date: new Date().toISOString().substring(0, 10),
//       dueDate: '',
//       notes: '',
//       signature: '',
//       vatEnabled: false,
//       businessRegNo: '',
//       businessTin: '',
//     },
//   });

//   const [items, setItems] = useState<InvoiceItem[]>([{ desc: '', qty: 1, price: 0 }]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const [todaysInvoices, setTodaysInvoices] = useState(0);

//   // Calculate usage limits based on user plan
//   // useEffect(() => {
//   //   const planConfig = {
//   //     free: {
//   //       canSendToClient: false,
//   //       dailyInvoicesLeft: Math.max(0, 3 - todaysInvoices),
//   //       canUseTemplates: false,
//   //       canUseQR: false,
//   //       canBulkSend: false,
//   //       planName: 'Free',
//   //       planIcon: Star
//   //     },
//   //     starter: {
//   //       canSendToClient: true,
//   //       dailyInvoicesLeft: Infinity,
//   //       canUseTemplates: true,
//   //       canUseQR: true,
//   //       canBulkSend: false,
//   //       planName: 'Starter',
//   //       planIcon: Zap
//   //     },
//   //     growth: {
//   //       canSendToClient: true,
//   //       dailyInvoicesLeft: Infinity,
//   //       canUseTemplates: true,
//   //       canUseQR: true,
//   //       canBulkSend: true,
//   //       planName: 'Growth',
//   //       planIcon: Crown
//   //     },
//   //     premium: {
//   //       canSendToClient: true,
//   //       dailyInvoicesLeft: Infinity,
//   //       canUseTemplates: true,
//   //       canUseQR: true,
//   //       canBulkSend: true,
//   //       planName: 'Premium',
//   //       planIcon: Crown
//   //     }
//   //   };

//   //   setUsageLimits(planConfig[userPlan as keyof typeof planConfig] || planConfig.free);
//   // }, [userPlan, todaysInvoices]);


// useEffect(() => {
//   const checkLimits = async () => {
//     if (session?.user?.id) {
//       const limitCheck = await checkInvoiceLimit(session.user.id, userPlan)
//       const planFeatures = getPlanFeatures(userPlan)
      
//       setUsageLimits({
//         canSendToClient: canUserPerform(userPlan, 'canSendToClient'),
//         dailyInvoicesLeft: limitCheck.remaining,
//         canUseTemplates: canUserPerform(userPlan, 'canUseQR'), // Adjust based on your actual feature names
//         canUseQR: canUserPerform(userPlan, 'canUseQR'),
//         canBulkSend: canUserPerform(userPlan, 'canBulkSend'),
//         planName: userPlan.charAt(0).toUpperCase() + userPlan.slice(1),
//         planIcon: userPlan === 'free' ? Star : userPlan === 'starter' ? Zap : userPlan === 'growth' ? Users : Crown
//       })
//     }
//   }
  
//   checkLimits()
// }, [userPlan, session?.user?.id, todaysInvoices])

//   // Watch form values for preview
//   const formData = watch();

//   const handleItemChange = (
//     index: number,
//     field: keyof InvoiceItem,
//     value: string | number
//   ) => {
//     const newItems = [...items];
//     if (field === 'qty' || field === 'price') {
//       newItems[index][field] = Number(value);
//     } else {
//       newItems[index][field] = value as string;
//     }
//     setItems(newItems);
//   };

//   const addItem = () => {
//     setItems([...items, { desc: '', qty: 1, price: 0 }]);
//   };

//   const removeItem = (index: number) => {
//     if (items.length > 1) {
//       const newItems = items.filter((_, i) => i !== index);
//       setItems(newItems);
//     }
//   };

//   const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
//   const vatAmount = formData.vatEnabled ? subtotal * 0.075 : 0;
//   const total = subtotal + vatAmount;

//   // Email to Me handler
//   const handleEmailToMe = async (data: FormData) => {
//     await onSubmit(data, '/api/invoice/generate');
//   };

//   // Send to Client handler
//   const handleSendToClient = async (data: FormData) => {
//     if (!usageLimits.canSendToClient) {
//       setMessage('Upgrade to Starter plan or higher to send invoices to clients');
//       return;
//     }
//     await onSubmit(data, '/api/invoice/send');
//   };

//   const onSubmit = async (data: FormData, endpoint: string) => {
//     // Check daily limit for free tier
//     if (userPlan === 'free' && usageLimits.dailyInvoicesLeft <= 0) {
//       setMessage('Daily invoice limit reached. Upgrade to create more invoices today.');
//       return;
//     }

//     // Check if client email is provided for paid plans when sending to client
//     if (endpoint.includes('send') && !data.clientEmail) {
//       setMessage('Client email is required to send invoices');
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     const formData = new FormData();
    
//     // Add all form data
//     Object.entries(data).forEach(([key, value]) => {
//       if (key === 'vatEnabled') {
//         formData.append(key, value ? 'true' : 'false');
//       } else {
//         formData.append(key, value as string);
//       }
//     });
    
//     // Add items as JSON
//     formData.append('items', JSON.stringify(items));
//     formData.append('subtotal', subtotal.toString());
//     formData.append('vatAmount', vatAmount.toString());
//     formData.append('total', total.toString());

//     try {
//       const res = await fetch(endpoint, { 
//         method: 'POST', 
//         body: formData 
//       });
      
//       const result = await res.json();
      
//       if (!res.ok) {
//         throw new Error(result.error || 'Failed to process invoice');
//       }
      
//       // Update daily count for free tier
//       if (userPlan === 'free') {
//         setTodaysInvoices(prev => prev + 1);
//       }
      
//       setMessage(endpoint.includes('send') ? 'Invoice sent to client!' : 'Invoice emailed to you!');
      
//       // Reset form on success
//       if (result.success) {
//         setItems([{ desc: '', qty: 1, price: 0 }]);
//         setValue('invoiceNo', 'INV-' + Date.now().toString().slice(-6));
//         setValue('date', new Date().toISOString().substring(0, 10));
//         setValue('clientEmail', '');
//       }
      
//     } catch (err: any) {
//       setMessage(err.message || 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const PlanBadge = () => {
//     const PlanIcon = usageLimits.planIcon;
//     return (
//       <Badge className={`flex items-center gap-1 ${
//         userPlan === 'free' ? 'bg-gray-100 text-gray-800' :
//         userPlan === 'starter' ? 'bg-blue-100 text-blue-800' :
//         userPlan === 'growth' ? 'bg-purple-100 text-purple-800' :
//         'bg-yellow-100 text-yellow-800'
//       }`}>
//         <PlanIcon className="w-3 h-3" />
//         {usageLimits.planName} Plan
//       </Badge>
//     );
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto p-6">
//       {/* Left Panel: Invoice Form */}
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>Create Invoice</CardTitle>
//             <PlanBadge />
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {/* Usage Alerts */}
//           {userPlan === 'free' && (
//             <div className={`p-4 rounded-lg border ${
//               usageLimits.dailyInvoicesLeft > 0 
//                 ? 'bg-blue-50 border-blue-200' 
//                 : 'bg-orange-50 border-orange-200'
//             }`}>
//               <div className="flex items-start gap-3">
//                 <AlertTriangle className={`w-5 h-5 mt-0.5 ${
//                   usageLimits.dailyInvoicesLeft > 0 ? 'text-blue-600' : 'text-orange-600'
//                 }`} />
//                 <div className="flex-1">
//                   <p className={`text-sm font-medium ${
//                     usageLimits.dailyInvoicesLeft > 0 ? 'text-blue-800' : 'text-orange-800'
//                   }`}>
//                     {usageLimits.dailyInvoicesLeft > 0 ? (
//                       <>You have <strong>{usageLimits.dailyInvoicesLeft} invoices left</strong> today on the Free plan</>
//                     ) : (
//                       <>Daily limit reached! Upgrade for unlimited invoices</>
//                     )}
//                   </p>
//                   {usageLimits.dailyInvoicesLeft <= 0 && (
//                     <Button 
//                       size="sm" 
//                       className="mt-2 bg-orange-600 hover:bg-orange-700"
//                       onClick={() => window.location.href = '/pricing'}
//                     >
//                       Upgrade Now
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {!usageLimits.canSendToClient && (
//             <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
//               <div className="flex items-start gap-3">
//                 <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-amber-800">
//                     Upgrade to <strong>Starter plan (₦2,000/month)</strong> to send invoices directly to clients
//                   </p>
//                   <Button 
//                     size="sm" 
//                     variant="outline" 
//                     className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100"
//                     onClick={() => window.location.href = '/pricing'}
//                   >
//                     View Plans
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Business Information */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Business Information</h3>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="businessName">Business Name *</Label>
//                 <Input 
//                   id="businessName"
//                   {...register('businessName', { required: 'Business name is required' })} 
//                 />
//                 {errors.businessName && (
//                   <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
//                 )}
//               </div>
//               <div>
//                 <Label htmlFor="businessEmail">Email *</Label>
//                 <Input 
//                   id="businessEmail"
//                   type="email"
//                   {...register('businessEmail', { 
//                     required: 'Email is required',
//                     pattern: {
//                       value: /^\S+@\S+$/i,
//                       message: 'Invalid email address'
//                     }
//                   })} 
//                 />
//                 {errors.businessEmail && (
//                   <p className="text-red-500 text-sm mt-1">{errors.businessEmail.message}</p>
//                 )}
//               </div>
//               <div>
//                 <Label htmlFor="businessPhone">Phone *</Label>
//                 <Input 
//                   id="businessPhone"
//                   {...register('businessPhone', { required: 'Phone is required' })} 
//                 />
//                 {errors.businessPhone && (
//                   <p className="text-red-500 text-sm mt-1">{errors.businessPhone.message}</p>
//                 )}
//               </div>
//               <div>
//                 <Label htmlFor="businessWebsite">Website</Label>
//                 <Input 
//                   id="businessWebsite"
//                   {...register('businessWebsite')} 
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="businessRegNo">RC No.</Label>
//                 <Input 
//                   id="businessRegNo"
//                   {...register('businessRegNo')} 
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="businessTin">TIN</Label>
//                 <Input 
//                   id="businessTin"
//                   {...register('businessTin')} 
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <Label htmlFor="businessAddress">Business Address</Label>
//                 <Textarea 
//                   id="businessAddress"
//                   {...register('businessAddress')} 
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Client Information */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Client Information</h3>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="clientName">Client Name *</Label>
//                 <Input 
//                   id="clientName"
//                   {...register('clientName', { required: 'Client name is required' })} 
//                 />
//                 {errors.clientName && (
//                   <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>
//                 )}
//               </div>
//               <div>
//                 <Label htmlFor="clientEmail">
//                   Client Email {usageLimits.canSendToClient ? '' : '(Upgrade to send)'}
//                 </Label>
//                 <Input 
//                   id="clientEmail"
//                   type="email"
//                   {...register('clientEmail')} 
//                   disabled={!usageLimits.canSendToClient}
//                   className={!usageLimits.canSendToClient ? 'bg-gray-100 cursor-not-allowed' : ''}
//                 />
//                 {!usageLimits.canSendToClient && (
//                   <p className="text-xs text-gray-500 mt-1">
//                     Available in Starter plan and above
//                   </p>
//                 )}
//               </div>
//               <div className="md:col-span-2">
//                 <Label htmlFor="clientAddress">Client Address *</Label>
//                 <Textarea 
//                   id="clientAddress"
//                   {...register('clientAddress', { required: 'Client address is required' })} 
//                 />
//                 {errors.clientAddress && (
//                   <p className="text-red-500 text-sm mt-1">{errors.clientAddress.message}</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Invoice Details */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="invoiceNo">Invoice Number</Label>
//                 <Input 
//                   id="invoiceNo"
//                   {...register('invoiceNo')} 
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="date">Date</Label>
//                 <Input 
//                   id="date"
//                   type="date"
//                   {...register('date')} 
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="dueDate">Due Date</Label>
//                 <Input 
//                   id="dueDate"
//                   type="date"
//                   {...register('dueDate')} 
//                 />
//               </div>
//               <div className="flex items-center gap-2">
//                 <Switch 
//                   checked={formData.vatEnabled} 
//                   onCheckedChange={(v) => setValue('vatEnabled', v)} 
//                 />
//                 <Label>Include VAT (7.5%)</Label>
//               </div>
//             </div>
//           </div>

//           {/* Items */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Items</h3>
//             {items.map((item, index) => (
//               <div key={index} className="grid grid-cols-12 gap-2 mb-3 items-start">
//                 <div className="col-span-5">
//                   <Input
//                     placeholder="Description"
//                     value={item.desc}
//                     onChange={(e) => handleItemChange(index, 'desc', e.target.value)}
//                   />
//                 </div>
//                 <div className="col-span-2">
//                   <Input
//                     type="number"
//                     placeholder="Qty"
//                     value={item.qty}
//                     onChange={(e) => handleItemChange(index, 'qty', Number(e.target.value))}
//                   />
//                 </div>
//                 <div className="col-span-3">
//                   <Input
//                     type="number"
//                     placeholder="Price"
//                     value={item.price}
//                     onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
//                   />
//                 </div>
//                 <div className="col-span-2">
//                   <Button 
//                     type="button" 
//                     variant="ghost" 
//                     size="icon" 
//                     onClick={() => removeItem(index)} 
//                     disabled={items.length === 1}
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))}
//             <Button 
//               type="button" 
//               variant="outline" 
//               size="sm" 
//               className="mt-2" 
//               onClick={addItem}
//             >
//               <Plus className="w-4 h-4 mr-1" /> Add Item
//             </Button>
//           </div>

//           {/* Additional Information */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <Label htmlFor="notes">Notes</Label>
//               <Textarea 
//                 id="notes"
//                 {...register('notes')} 
//                 placeholder="Additional notes or terms..."
//               />
//             </div>
//             <div>
//               <Label htmlFor="signature">Signature</Label>
//               <Input 
//                 id="signature"
//                 {...register('signature')} 
//                 placeholder="Your name or signature"
//               />
//             </div>
//           </div>

//           {/* Submit Buttons */}
//           <div className="flex gap-3 pt-4">
//             <Button 
//               type="button" 
//               className="flex-1" 
//               disabled={loading || (userPlan === 'free' && usageLimits.dailyInvoicesLeft <= 0)}
//               onClick={handleSubmit(handleEmailToMe)}
//             >
//               {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
//               Email to Me
//             </Button>
            
//             <Button 
//               type="button" 
//               className="flex-1 bg-green-600 hover:bg-green-700" 
//               disabled={loading || !usageLimits.canSendToClient}
//               onClick={handleSubmit(handleSendToClient)}
//             >
//               {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
//               Send to Client
//               {!usageLimits.canSendToClient && (
//                 <Crown className="w-3 h-3 ml-1" />
//               )}
//             </Button>
//           </div>

//           {message && (
//             <p className={`mt-4 text-center ${
//               message.includes('error') || message.includes('Error') || message.includes('Failed') || message.includes('limit') || message.includes('Upgrade')
//                 ? 'text-red-500' 
//                 : 'text-green-600'
//             }`}>
//               {message}
//             </p>
//           )}
//         </CardContent>
//       </Card>

    
// {/* 
// <div className="space-y-6">
//             {/* Bulk Send Feature - Only show for Growth/Premium users */}
//             {/* {(userPlan === 'growth' || userPlan === 'premium') && (
//               <BulkInvoiceSender />
//             )} */}
            
//             {/* You can add other sidebar components here later */}
//             {/* Quick Stats, Recent Invoices, Client Management, etc. */}
//           {/* </div>       */} 





//             {/* Right Panel: Invoice Preview */}
//       <Card className="sticky top-6">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             Invoice Preview
//             <PlanBadge />
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {/* Business Info */}
//             <div>
//               <h3 className="font-semibold text-lg">{formData.businessName || 'Your Company'}</h3>
//               {formData.businessEmail && <p className="text-sm text-gray-600">Email: {formData.businessEmail}</p>}
//               {formData.businessPhone && <p className="text-sm text-gray-600">Phone: {formData.businessPhone}</p>}
//               {formData.businessWebsite && <p className="text-sm text-gray-600">Website: {formData.businessWebsite}</p>}
//               {formData.businessAddress && <p className="text-sm text-gray-600">Address: {formData.businessAddress}</p>}
//               {formData.businessRegNo && <p className="text-sm text-gray-600">RC No: {formData.businessRegNo}</p>}
//               {formData.businessTin && <p className="text-sm text-gray-600">TIN: {formData.businessTin}</p>}
//             </div>

//             {/* Invoice Details */}
//             <div className="border-t pt-4">
//               <p><strong>Invoice No:</strong> {formData.invoiceNo}</p>
//               <p><strong>Date:</strong> {formData.date}</p>
//               {formData.dueDate && <p><strong>Due Date:</strong> {formData.dueDate}</p>}
//             </div>

//             {/* Client Info */}
//             <div className="border-t pt-4">
//               <p><strong>Bill To:</strong> {formData.clientName || 'Client Name'}</p>
//               {formData.clientAddress && <p className="text-sm">{formData.clientAddress}</p>}
//               {formData.clientEmail && <p className="text-sm">Email: {formData.clientEmail}</p>}
//             </div>

//             {/* Items Table */}
//             <div className="border-t pt-4">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b">
//                     <th className="text-left pb-2">Description</th>
//                     <th className="text-center pb-2">Qty</th>
//                     <th className="text-right pb-2">Price</th>
//                     <th className="text-right pb-2">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {items.map((item, i) => (
//                     <tr key={i} className="border-b">
//                       <td className="py-2">{item.desc || '-'}</td>
//                       <td className="text-center py-2">{item.qty}</td>
//                       <td className="text-right py-2">₦{item.price.toLocaleString()}</td>
//                       <td className="text-right py-2">₦{(item.qty * item.price).toLocaleString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Totals */}
//             <div className="border-t pt-4 space-y-2">
//               <div className="flex justify-between">
//                 <span>Subtotal:</span>
//                 <span>₦{subtotal.toLocaleString()}</span>
//               </div>
//               {formData.vatEnabled && (
//                 <div className="flex justify-between">
//                   <span>VAT (7.5%):</span>
//                   <span>₦{vatAmount.toLocaleString()}</span>
//                 </div>
//               )}
//               <div className="flex justify-between font-bold text-lg border-t pt-2">
//                 <span>TOTAL:</span>
//                 <span>₦{total.toLocaleString()}</span>
//               </div>
//             </div>

//             {/* Notes & Signature */}
//             {formData.notes && (
//               <div className="border-t pt-4">
//                 <p><strong>Notes:</strong> {formData.notes}</p>
//               </div>
//             )}
//             {formData.signature && (
//               <div className="border-t pt-4">
//                 <p><strong>Signature:</strong> {formData.signature}</p>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }






// components/InvoiceForm.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Loader2, Mail, Send, AlertTriangle, Crown, Zap, Star, Users, Upload, Image, Palette } from 'lucide-react';

import { getPlanFeatures, checkInvoiceLimit, canUserPerform } from '@/lib/plan-utils';

type InvoiceItem = {
  desc: string;
  qty: number;
  price: number;
};

interface FormData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessWebsite: string;
  businessAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  notes: string;
  signature: string;
  vatEnabled: boolean;
  businessRegNo: string;
  businessTin: string;
  template: string; // NEW: Template selection
}

interface UsageLimits {
  canSendToClient: boolean;
  dailyInvoicesLeft: number;
  canUseTemplates: boolean;
  canUseQR: boolean;
  canBulkSend: boolean;
  planName: string;
  planIcon: any;
}

// NEW: Beautiful template options
const TEMPLATES = [
  { id: 'modern', name: 'Modern Blue', colors: { primary: '#2563eb', secondary: '#64748b' } },
  { id: 'professional', name: 'Professional Gray', colors: { primary: '#374151', secondary: '#6b7280' } },
  { id: 'elegant', name: 'Elegant Purple', colors: { primary: '#7c3aed', secondary: '#8b5cf6' } },
  { id: 'minimal', name: 'Minimal Green', colors: { primary: '#059669', secondary: '#10b981' } },
];

export default function InvoiceForm({ isFreeMode }: { isFreeMode?: boolean }) {
  const { data: session } = useSession();
  const userPlan = (session?.user as any)?.plan || 'free';
  
  const [usageLimits, setUsageLimits] = useState<UsageLimits>({
    canSendToClient: false,
    dailyInvoicesLeft: 3,
    canUseTemplates: false,
    canUseQR: false,
    canBulkSend: false,
    planName: 'Free',
    planIcon: Star
  });

  // NEW: Logo upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    defaultValues: {
      businessName: '',
      businessEmail: '',
      businessPhone: '',
      businessWebsite: '',
      businessAddress: '',
      clientName: '',
      clientEmail: '',
      clientAddress: '',
      invoiceNo: 'INV-' + Date.now().toString().slice(-6),
      date: new Date().toISOString().substring(0, 10),
      dueDate: '',
      notes: '',
      signature: '',
      vatEnabled: false,
      businessRegNo: '',
      businessTin: '',
      template: 'modern', // NEW: Default template
    },
  });

  const [items, setItems] = useState<InvoiceItem[]>([{ desc: '', qty: 1, price: 0 }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [todaysInvoices, setTodaysInvoices] = useState(0);

  useEffect(() => {
    const checkLimits = async () => {
      if (session?.user?.id) {
        const limitCheck = await checkInvoiceLimit(session.user.id, userPlan)
        const planFeatures = getPlanFeatures(userPlan)
        
        setUsageLimits({
          canSendToClient: canUserPerform(userPlan, 'canSendToClient'),
          dailyInvoicesLeft: limitCheck.remaining,
          canUseTemplates: canUserPerform(userPlan, 'canUseQR'),
          canUseQR: canUserPerform(userPlan, 'canUseQR'),
          canBulkSend: canUserPerform(userPlan, 'canBulkSend'),
          planName: userPlan.charAt(0).toUpperCase() + userPlan.slice(1),
          planIcon: userPlan === 'free' ? Star : userPlan === 'starter' ? Zap : userPlan === 'growth' ? Users : Crown
        })
      }
    }
    
    checkLimits()
  }, [userPlan, session?.user?.id, todaysInvoices]);

  // NEW: Handle logo upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setMessage('Please upload an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setMessage('Image must be smaller than 2MB');
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // NEW: Remove logo
  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...items];
    if (field === 'qty' || field === 'price') {
      newItems[index][field] = Number(value);
    } else {
      newItems[index][field] = value as string;
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { desc: '', qty: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const vatAmount = watch('vatEnabled') ? subtotal * 0.075 : 0;
  const total = subtotal + vatAmount;

  // Email to Me handler
  const handleEmailToMe = async (data: FormData) => {
    await onSubmit(data, '/api/invoice/generate');
  };

  // Send to Client handler
  const handleSendToClient = async (data: FormData) => {
    if (!usageLimits.canSendToClient) {
      setMessage('Upgrade to Starter plan or higher to send invoices to clients');
      return;
    }
    await onSubmit(data, '/api/invoice/send');
  };

  const onSubmit = async (data: FormData, endpoint: string) => {
    // Check daily limit for free tier
    if (userPlan === 'free' && usageLimits.dailyInvoicesLeft <= 0) {
      setMessage('Daily invoice limit reached. Upgrade to create more invoices today.');
      return;
    }

    // Check if client email is provided for paid plans when sending to client
    if (endpoint.includes('send') && !data.clientEmail) {
      setMessage('Client email is required to send invoices');
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    
    // Add all form data
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'vatEnabled') {
        formData.append(key, value ? 'true' : 'false');
      } else {
        formData.append(key, value as string);
      }
    });
    
    // NEW: Add logo file if uploaded
    if (logoFile) {
      formData.append('businessLogo', logoFile);
    }
    
    // Add items as JSON
    formData.append('items', JSON.stringify(items));
    formData.append('subtotal', subtotal.toString());
    formData.append('vatAmount', vatAmount.toString());
    formData.append('total', total.toString());

    try {
      const res = await fetch(endpoint, { 
        method: 'POST', 
        body: formData 
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to process invoice');
      }
      
      // Update daily count for free tier
      if (userPlan === 'free') {
        setTodaysInvoices(prev => prev + 1);
      }
      
      setMessage(endpoint.includes('send') ? 'Invoice sent to client!' : 'Invoice emailed to you!');
      
      // Reset form on success
      if (result.success) {
        setItems([{ desc: '', qty: 1, price: 0 }]);
        setValue('invoiceNo', 'INV-' + Date.now().toString().slice(-6));
        setValue('date', new Date().toISOString().substring(0, 10));
        setValue('clientEmail', '');
        removeLogo(); // NEW: Clear logo on success
      }
      
    } catch (err: any) {
      setMessage(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const PlanBadge = () => {
    const PlanIcon = usageLimits.planIcon;
    return (
      <Badge className={`flex items-center gap-1 ${
        userPlan === 'free' ? 'bg-gray-100 text-gray-800' :
        userPlan === 'starter' ? 'bg-blue-100 text-blue-800' :
        userPlan === 'growth' ? 'bg-purple-100 text-purple-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        <PlanIcon className="w-3 h-3" />
        {usageLimits.planName} Plan
      </Badge>
    );
  };

  // NEW: Get current template colors
  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto p-6">
      {/* Left Panel: Invoice Form */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Create Beautiful Invoice</CardTitle>
            <PlanBadge />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Usage Alerts */}
          {userPlan === 'free' && (
            <div className={`p-4 rounded-lg border ${
              usageLimits.dailyInvoicesLeft > 0 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                  usageLimits.dailyInvoicesLeft > 0 ? 'text-blue-600' : 'text-orange-600'
                }`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    usageLimits.dailyInvoicesLeft > 0 ? 'text-blue-800' : 'text-orange-800'
                  }`}>
                    {usageLimits.dailyInvoicesLeft > 0 ? (
                      <>You have <strong>{usageLimits.dailyInvoicesLeft} invoices left</strong> today on the Free plan</>
                    ) : (
                      <>Daily limit reached! Upgrade for unlimited invoices</>
                    )}
                  </p>
                  {usageLimits.dailyInvoicesLeft <= 0 && (
                    <Button 
                      size="sm" 
                      className="mt-2 bg-orange-600 hover:bg-orange-700"
                      onClick={() => window.location.href = '/pricing'}
                    >
                      Upgrade Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {!usageLimits.canSendToClient && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">
                    Upgrade to <strong>Starter plan (₦2,000/month)</strong> to send invoices directly to clients
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    View Plans
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* NEW: Logo Upload Section */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-blue-600" />
              Business Logo & Branding
            </h3>
            
            <div className="space-y-4">
              {/* Logo Upload */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Business Logo" 
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Label 
                    htmlFor="logo-upload" 
                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    PNG, JPG up to 2MB • All plans support logos
                  </p>
                  {logoPreview && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={removeLogo}
                      className="mt-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove Logo
                    </Button>
                  )}
                </div>
              </div>

              {/* Template Selection */}
              <div>
                <Label htmlFor="template" className="flex items-center gap-2 mb-2">
                  <Palette className="w-4 h-4 text-purple-600" />
                  Invoice Template
                </Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATES.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: template.colors.primary }}
                          />
                          {template.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose a beautiful template for your invoice
                </p>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Business Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input 
                  id="businessName"
                  {...register('businessName', { required: 'Business name is required' })} 
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="businessEmail">Email *</Label>
                <Input 
                  id="businessEmail"
                  type="email"
                  {...register('businessEmail', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })} 
                />
                {errors.businessEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessEmail.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="businessPhone">Phone *</Label>
                <Input 
                  id="businessPhone"
                  {...register('businessPhone', { required: 'Phone is required' })} 
                />
                {errors.businessPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessPhone.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="businessWebsite">Website</Label>
                <Input 
                  id="businessWebsite"
                  {...register('businessWebsite')} 
                />
              </div>
              <div>
                <Label htmlFor="businessRegNo">RC No.</Label>
                <Input 
                  id="businessRegNo"
                  {...register('businessRegNo')} 
                />
              </div>
              <div>
                <Label htmlFor="businessTin">TIN</Label>
                <Input 
                  id="businessTin"
                  {...register('businessTin')} 
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea 
                  id="businessAddress"
                  {...register('businessAddress')} 
                />
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Client Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Client Name *</Label>
                <Input 
                  id="clientName"
                  {...register('clientName', { required: 'Client name is required' })} 
                />
                {errors.clientName && (
                  <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="clientEmail">
                  Client Email {usageLimits.canSendToClient ? '' : '(Upgrade to send)'}
                </Label>
                <Input 
                  id="clientEmail"
                  type="email"
                  {...register('clientEmail')} 
                  disabled={!usageLimits.canSendToClient}
                  className={!usageLimits.canSendToClient ? 'bg-gray-100 cursor-not-allowed' : ''}
                />
                {!usageLimits.canSendToClient && (
                  <p className="text-xs text-gray-500 mt-1">
                    Available in Starter plan and above
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="clientAddress">Client Address *</Label>
                <Textarea 
                  id="clientAddress"
                  {...register('clientAddress', { required: 'Client address is required' })} 
                />
                {errors.clientAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.clientAddress.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceNo">Invoice Number</Label>
                <Input 
                  id="invoiceNo"
                  {...register('invoiceNo')} 
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date"
                  type="date"
                  {...register('date')} 
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate"
                  type="date"
                  {...register('dueDate')} 
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={watch('vatEnabled')} 
                  onCheckedChange={(v) => setValue('vatEnabled', v)} 
                />
                <Label>Include VAT (7.5%)</Label>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Items</h3>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-3 items-start">
                <div className="col-span-5">
                  <Input
                    placeholder="Description"
                    value={item.desc}
                    onChange={(e) => handleItemChange(index, 'desc', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => handleItemChange(index, 'qty', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeItem(index)} 
                    disabled={items.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={addItem}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Item
            </Button>
          </div>

          {/* Additional Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes"
                {...register('notes')} 
                placeholder="Additional notes or terms..."
              />
            </div>
            <div>
              <Label htmlFor="signature">Signature</Label>
              <Input 
                id="signature"
                {...register('signature')} 
                placeholder="Your name or signature"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              className="flex-1" 
              disabled={loading || (userPlan === 'free' && usageLimits.dailyInvoicesLeft <= 0)}
              onClick={handleSubmit(handleEmailToMe)}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
              Email to Me
            </Button>
            
            <Button 
              type="button" 
              className="flex-1 bg-green-600 hover:bg-green-700" 
              disabled={loading || !usageLimits.canSendToClient}
              onClick={handleSubmit(handleSendToClient)}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Send to Client
              {!usageLimits.canSendToClient && (
                <Crown className="w-3 h-3 ml-1" />
              )}
            </Button>
          </div>

          {message && (
            <p className={`mt-4 text-center ${
              message.includes('error') || message.includes('Error') || message.includes('Failed') || message.includes('limit') || message.includes('Upgrade')
                ? 'text-red-500' 
                : 'text-green-600'
            }`}>
              {message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Right Panel: Enhanced Invoice Preview */}
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Beautiful Invoice Preview
            <PlanBadge />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="space-y-6 p-6 rounded-lg border-2"
            style={{ 
              borderColor: currentTemplate.colors.primary + '20',
              backgroundColor: 'white'
            }}
          >
            {/* Header with Logo */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                {logoPreview && (
                  <img 
                    src={logoPreview} 
                    alt="Business Logo" 
                    className="h-12 mb-3 object-contain"
                  />
                )}
                <h3 
                  className="font-bold text-2xl"
                  style={{ color: currentTemplate.colors.primary }}
                >
                  {watch('businessName') || 'Your Company'}
                </h3>
                {watch('businessEmail') && <p className="text-sm text-gray-600">Email: {watch('businessEmail')}</p>}
                {watch('businessPhone') && <p className="text-sm text-gray-600">Phone: {watch('businessPhone')}</p>}
                {watch('businessWebsite') && <p className="text-sm text-gray-600">Website: {watch('businessWebsite')}</p>}
                {watch('businessAddress') && <p className="text-sm text-gray-600">Address: {watch('businessAddress')}</p>}
                {watch('businessRegNo') && <p className="text-sm text-gray-600">RC No: {watch('businessRegNo')}</p>}
                {watch('businessTin') && <p className="text-sm text-gray-600">TIN: {watch('businessTin')}</p>}
              </div>
              
              {/* Invoice Details */}
              <div className="text-right">
                <h4 
                  className="text-xl font-bold mb-2"
                  style={{ color: currentTemplate.colors.primary }}
                >
                  INVOICE
                </h4>
                <p><strong>Invoice No:</strong> {watch('invoiceNo')}</p>
                <p><strong>Date:</strong> {watch('date')}</p>
                {watch('dueDate') && <p><strong>Due Date:</strong> {watch('dueDate')}</p>}
              </div>
            </div>

            {/* Client Info */}
            <div className="border-b pb-4">
              <h4 className="font-semibold mb-2" style={{ color: currentTemplate.colors.primary }}>
                Bill To:
              </h4>
              <p className="font-medium">{watch('clientName') || 'Client Name'}</p>
              {watch('clientAddress') && <p className="text-sm">{watch('clientAddress')}</p>}
              {watch('clientEmail') && <p className="text-sm">Email: {watch('clientEmail')}</p>}
            </div>

            {/* Items Table */}
            <div>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: currentTemplate.colors.primary + '10' }}>
                    <th className="text-left p-3 font-semibold">Description</th>
                    <th className="text-center p-3 font-semibold">Qty</th>
                    <th className="text-right p-3 font-semibold">Price</th>
                    <th className="text-right p-3 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-3">{item.desc || '-'}</td>
                      <td className="text-center p-3">{item.qty}</td>
                      <td className="text-right p-3">₦{item.price.toLocaleString()}</td>
                      <td className="text-right p-3">₦{(item.qty * item.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              {watch('vatEnabled') && (
                <div className="flex justify-between">
                  <span>VAT (7.5%):</span>
                  <span>₦{vatAmount.toLocaleString()}</span>
                </div>
              )}
              <div 
                className="flex justify-between font-bold text-lg pt-2 border-t"
                style={{ borderColor: currentTemplate.colors.primary }}
              >
                <span>TOTAL:</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Notes & Signature */}
            {watch('notes') && (
              <div className="border-t pt-4">
                <p><strong>Notes:</strong> {watch('notes')}</p>
              </div>
            )}
            {watch('signature') && (
              <div className="border-t pt-4">
                <p><strong>Signature:</strong> {watch('signature')}</p>
              </div>
            )}

            {/* Template Footer */}
            <div 
              className="text-center text-xs text-gray-500 pt-4 border-t"
              style={{ borderColor: currentTemplate.colors.primary + '20' }}
            >
              Created with iBiz Invoice Generator • {currentTemplate.name} Template
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}