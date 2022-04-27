import {fetchStocks} from "./stocks.service";
import {calculateTransactions, fetchTransactions,} from "./transaction.service";
import {SkusEntity} from "../entities";
import stocks from '../data/stock.json'
import transactions from '../data/transactions.json'


/**
 * Returns stocks for given type and sku.
 * @function fetchSKUs
 * @param {string} sku  stock item.
 */
export async function fetchSKUs(sku: string): Promise<SkusEntity> {
  try {

    const skuS: SkusEntity = {sku: sku, qty: 0};
    // Fetching stocks
    const currentStocks = await fetchStocks(sku, stocks);
    // Fetching transactions
    const currentTransactions = await fetchTransactions(sku, transactions);

    //Combining and returning result
    const quantity = await calculateTransactions(currentTransactions,
        currentStocks.stock
    );

    //Combining and returning result
    return {...skuS, qty: quantity};
  } catch (e: any) {
    return e.message;
  }
}
