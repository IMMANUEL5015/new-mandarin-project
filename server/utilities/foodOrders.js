exports.calcTotalAmount = (allFoodOrders) => {
    let total = 0;
    for (i = 0; i < allFoodOrders.length; i++) {
        total += allFoodOrders[i].cost;
    }
    return total;
}
