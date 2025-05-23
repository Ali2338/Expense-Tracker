
/*import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth'; // Custom hook to handle user authentication and redirection
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import InfoCard from '../../components/cards/InfoCard';
import { addThousandSeparator } from '../../utils/helper'; // Utility function to format numbers
import RecentTransactions from '../../components/Dashboard/RecentTransactions'; // Assuming you have a RecentTransactions component
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom for navigation
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { IoMdCard } from 'react-icons/io';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30DaysExpenses from '../../components/Dashboard/last30DaysExpenses';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';


const Home = () => {
  useUserAuth();  // This will handle fetching user info and redirecting if necessary
  const navigate = useNavigate(); // Assuming you have a navigate function from react-router-dom
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);
      if (response.data) {
        setDashboardData(response.data);
        //console.log("Dashboard data response:", response.data);
        if (response.data.isOverBudget) {
          alert(`⚠️ You have exceeded your budget limit !`);
        }
        //₹${addThousandSeparator(response.data.budgetLimit)}
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData(); // Fetch dashboard data when the component mounts

    // Cleanup function (runs on unmount)
    return () => { };
  }, []);  // Empty dependency array means this runs once when the component mounts


  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-4 mx-auto">
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <InfoCard
            icon={<IoMdCard />}
            label="Total balance"
            value={addThousandSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandSeparator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandSeparator(dashboardData?.totalExpense || 0)}
            color="bg-red-500"
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
         <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/expense")}
          />
          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalExpense={dashboardData?.totalExpense || 0}
            totalIncome={dashboardData?.totalIncome || 0}
          />
          <ExpenseTransactions
            transactions = {dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore = {()=> navigate("/expense")}
            />

          <Last30DaysExpenses 
             data = {dashboardData?.last30DaysExpenses?.transactions || []}
             />

          <RecentIncomeWithChart
             data = {dashboardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
             totalIncome = {dashboardData?.totalIncome || 0}
             />

          <RecentIncome
            transactions = {dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore = {()=> navigate("/income")}
            />

        </div>
      </div>
    </DashboardLayout>
  )
};

export default Home;

*/

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import InfoCard from '../../components/cards/InfoCard';
import { addThousandSeparator } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { IoMdCard } from 'react-icons/io';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30DaysExpenses from '../../components/Dashboard/last30DaysExpenses';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';

const Home = () => {
  useUserAuth(); // Handle user authentication
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newBudgetLimit, setNewBudgetLimit] = useState(0); // Set to 0 by default
  const [budgetUpdateError, setBudgetUpdateError] = useState('');
  const [isUpdatingBudget, setIsUpdatingBudget] = useState(false); // To manage loading state for budget update

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);
      if (response.data) {
        setDashboardData(response.data);
        setNewBudgetLimit(response.data.budgetLimit || 0); // Set the budget limit from fetched data
        if ((response.data.isOverBudget) && (response.data.budgetLimit > 0)) {
          alert(`⚠️ You have exceeded your budget limit!`);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle budget limit change
  const handleBudgetChange = async (e) => {
    e.preventDefault();
    setIsUpdatingBudget(true); // Set loading state to true
    try {
      const response = await axiosInstance.put(API_PATHS.DASHBOARD.SET_BUDGET, {
        budgetLimit: newBudgetLimit,
    });
    ;
      if (response.data.success) {
        fetchDashboardData(); // Re-fetch data after successful update
        setBudgetUpdateError('');
      }
    } catch (error) {
      console.error('Error updating budget limit:', error);
      setBudgetUpdateError('Failed to update budget, please try again.');
    } finally {
      setIsUpdatingBudget(false); // Reset loading state
    }
  };

  useEffect(() => {
    fetchDashboardData(); // Fetch data on component mount
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-4 mx-auto">
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <InfoCard
            icon={<IoMdCard />}
            label="Total balance"
            value={addThousandSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandSeparator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandSeparator(dashboardData?.totalExpense || 0)}
            color="bg-red-500"
          />
        </div>

        {/* Budget Update Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">Set Budget Limit</h2>
              <p className="text-sm text-gray-500">Set your desired monthly budget limit.</p>
            </div>
            <form onSubmit={handleBudgetChange} className="flex items-center space-x-4">
              <input
                type="number"
                value={newBudgetLimit}
                onChange={(e) => setNewBudgetLimit(Number(e.target.value))}
                className="border p-2 rounded"
                placeholder="Enter budget"
                min="0"
              />
              <button 
                type="submit" 
                className={`bg-blue-500 text-white p-2 rounded ${isUpdatingBudget ? 'opacity-50 cursor-not-allowed' : ''}`} 
                disabled={isUpdatingBudget}
              >
                {isUpdatingBudget ? 'Saving...' : 'Save Budget'}
              </button>
            </form>
          </div>
          {budgetUpdateError && <p className="text-red-500 mt-2">{budgetUpdateError}</p>}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
          />
          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalExpense={dashboardData?.totalExpense || 0}
            totalIncome={dashboardData?.totalIncome || 0}
          />
          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={() => navigate("/expense")}
          />
          <Last30DaysExpenses data={dashboardData?.last30DaysExpenses?.transactions || []} />
          <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []}
            totalIncome={dashboardData?.totalIncome || 0}
          />
          <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore={() => navigate("/income")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
