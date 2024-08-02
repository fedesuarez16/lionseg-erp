/**
 * v0 by Vercel.
 * @see https://v0.dev/t/O4q5Z7ehuyS
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function Component() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <Package2Icon className="h-6 w-6" />
            <span className="font-bold">SBMS</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
              Inventory
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
              Invoices
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
              Payments
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
              Expenses
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
              Customers
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                  <img
                    src="/placeholder.svg"
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="container py-8 px-4 md:px-6">
          <div className="grid gap-8">
            <section>
              <div className="flex items-center justify-between">
                <div className="grid gap-1">
                  <h1 className="text-2xl font-bold">Inventory Management</h1>
                  <p className="text-muted-foreground">Track and manage your business inventory.</p>
                </div>
                <Button>Add Product</Button>
              </div>
              <Separator className="my-6" />
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Stock</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Reorder Level</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">Acme Widgets</div>
                            <div className="text-sm text-muted-foreground">Widgets for all your needs</div>
                          </TableCell>
                          <TableCell>AW-001</TableCell>
                          <TableCell>
                            <Badge variant="outline">50</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">25</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="icon">
                              <FilePenIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="outline" size="icon">
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">Acme Gizmos</div>
                            <div className="text-sm text-muted-foreground">Gizmos for all your needs</div>
                          </TableCell>
                          <TableCell>AG-002</TableCell>
                          <TableCell>
                            <Badge variant="outline">75</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">30</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="icon">
                              <FilePenIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="outline" size="icon">
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">Acme Doohickeys</div>
                            <div className="text-sm text-muted-foreground">Doohickeys for all your needs</div>
                          </TableCell>
                          <TableCell>AD-003</TableCell>
                          <TableCell>
                            <Badge variant="outline">25</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">10</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="icon">
                              <FilePenIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="outline" size="icon">
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Reorder Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Reorder Level</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">Acme Doohickeys</div>
                            <div className="text-sm text-muted-foreground">Doohickeys for all your needs</div>
                          </TableCell>
                          <TableCell>AD-003</TableCell>
                          <TableCell>
                            <Badge variant="outline">10</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">25</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="icon">
                              <FilePenIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="outline" size="icon">
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </section>
            <section>
              <div className="flex items-center justify-between">
                <div className="grid gap-1">
                  <h1 className="text-2xl font-bold">Invoice Management</h1>
                  <p className="text-muted-foreground">Create and manage your business invoices.</p>
                </div>
                <Button>Create Invoice</Button>
              </div>
              <Separator className="my-6" />
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">INV-001</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">Acme Inc.</div>
                            <div className="text-sm text-muted-foreground">John Doe</div>
                          </TableCell>
                          <TableCell>$1,250.00</TableCell>
                          <TableCell>
                            <Badge variant="secondary">Paid</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="icon">
                              <FilePenIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="outline" size="icon">
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">INV-002</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">Globex Corp.</div>
                            <div className="text-sm text-muted-foreground">Jane Smith</div>
                          </TableCell>
                          <TableCell>$750.00</TableCell>
                          <TableCell>
                            <Badge variant="outline">Pending</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="icon">
                              <FilePenIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="outline" size="icon">
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">INV-003</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">Stark Industries</div>
                            <div className="text-sm text-muted-foreground">Tony Stark</div>
                          </TableCell>
                          <TableCell>$2,500.00</TableCell>
                          <TableCell>
                            <Badge variant="outline">Overdue</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="icon">
                              <FilePenIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="outline" size="icon">
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </section>
            <section>
              <div className="flex items-center justify-between">
                <div className="grid gap-1">
                  <h1 className="text-2xl font-bold">Payment Management</h1>
                  <p className="text-muted-foreground">Manage your business payments and transactions.</p>
                </div>
                <Button>Process Payment</Button>
              </div>
              <Separator className="my-6" />
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">INV-001</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">Acme Inc.</div>
                            <div className="text-sm text-muted-foreground">John Doe</div>
                          </TableCell>
                          <TableCell>$1,250.00</TableCell>
                          <TableCell>Credit Card</TableCell>
                          <TableCell>2023-04-15</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">INV-002</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">Globex Corp.</div>
                            <div className="text-sm text-muted-foreground">Jane Smith</div>
                          </TableCell>
                          <TableCell>$750.00</TableCell>
                          <TableCell>PayPal</TableCell>
                          <TableCell>2023-03-30</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">INV-003</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">Stark Industries</div>
                            <div className="text-sm text-muted-foreground">Tony Stark</div>
                          </TableCell>
                          <TableCell>$2,500.00</TableCell>
                          <TableCell>Bank Transfer</TableCell>
                          <TableCell>2023-02-28</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </section>
            <section />
          </div>
        </div>
      </main>
    </div>
  )
}

function FilePenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  )
}


function Package2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}


function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}


function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}