exports.calcTotalAmount = (allOrders) => {
    let total = 0;
    for (i = 0; i < allOrders.length; i++) {
        total += allOrders[i].cost;
    }
    return total;
}
