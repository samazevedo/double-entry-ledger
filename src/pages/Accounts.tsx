import { Textarea } from '../components/ui/textarea';
import { Table, TableBody, TableCell, TableCaption, TableFooter, TableHead, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';

const AccountsData = [
  {
    code: '1000',
    name: 'Cash',
    type: 'Asset',
    normalBalance: 'Debit',
    status: 'Active',
  },
  {
    code: '1090',
    name: "Owner's Equity",
    type: 'Equity',
    normalBalance: 'Credit',
    status: 'Deactive',
  },
  {
    code: '2000',
    name: 'Accounts Payable',
    type: 'Liability',
    normalBalance: 'Credit',
    status: 'Active',
  },
];

export function Accounts() {
  return (
    <>
      <header className=" grid grid-cols-2 gap-4">
        <div>
          <h1>Chart of Accounts</h1>
          <p>Manage the accounts used by your company.</p>
        </div>
        <div className="flex justify-end items-center">
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            + New Account
          </Button>
        </div>
      </header>
      <div>
        <Textarea placeholder="Search accounts..." />
        <Table>
          <TableCaption>A list of your accounts.</TableCaption>
          <TableHead>
            <TableRow className="bg-gray-100 dark:bg-gray-800">
              <TableHead>Code</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Normal Balance</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHead>
          <TableBody>
            {AccountsData.map((account) => (
              <TableRow key={account.code}>
                <TableCell>{account.code}</TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.type}</TableCell>
                <TableCell>{account.normalBalance}</TableCell>
                <TableCell>{account.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <p>Total Accounts: {AccountsData.length}</p>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}
