export const validateEmail = (email) => {
    const Regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return Regex.test(email);
}

export const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    let initials = "";
    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }
    return initials.toUpperCase();  // Added parentheses to the method
};

export const addThousandSeparator = (num) => {
    if (num === null || isNaN(num)) return "";
    const[integerPart,fractionalPart] = num.toString().split(".");
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    return fractionalPart ? `${formattedIntegerPart}.${fractionalPart}` : formattedIntegerPart;
}

export const prepareExpenseBarChartData = (data = []) => {

    const ChartData = data.map((item)=>({
        category: item?.category,
        amount : item?.amount,
    }));
    return ChartData;
}

