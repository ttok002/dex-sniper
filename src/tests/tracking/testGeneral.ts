import { TxTracker } from '../../tracking/TxTracker';

const txTracker = new TxTracker();
const id = txTracker.add('', ['out', 'trigger']);
console.log(txTracker.getAllTxs());
txTracker.update(id, '0x123');
console.log(txTracker.getAllTxs());
txTracker.addTiming(id, 'sent');
console.log(txTracker.getAllTxs());
console.log(txTracker.formatTimings(id));
console.log(txTracker.getTxsByTag(['keep']));
