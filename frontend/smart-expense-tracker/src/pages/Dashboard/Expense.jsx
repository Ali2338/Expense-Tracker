import react from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
const Expense = () => { 
    useUserAuth();

    return (
        <div>
            <h1>Expense Page</h1>
        </div>
    );
}
export default Expense;