import { Route, Routes } from 'react-router'
import { Layout } from './components/layout/Layout';
import { Accounts } from './pages/Accounts'
import {Dashboard} from './pages/Dashboard'
import { JournalEntries } from './pages/JournalEntries'
import {Ledger} from './pages/Ledger'
import {Reports} from './pages/Reports'
export const App = () => {
    return(
        <Routes>
            <Route element={<Layout/>}>
                <Route index element={<Dashboard/>} />
                <Route path="/accounts" element={<Accounts/>} />
                <Route path="/journal-entries" element={<JournalEntries/>} />
                <Route path="/general-ledger" element={<Ledger/>} />
                <Route path="/reports" element={<Reports/>} />
            </Route>
        </Routes>
    )
}