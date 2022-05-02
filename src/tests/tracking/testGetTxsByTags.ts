import { TxTracker } from '../../tracking/TxTracker';

const txTracker = new TxTracker();

const id1 = txTracker.add('', ['out', 'trigger']);
txTracker.update(id1, '0x123');
txTracker.addTiming(id1, 'sent');
console.log(txTracker.formatTimings(id1));

const id2 = txTracker.add('', ['out', 'keep']);
txTracker.update(id2, '0x123');
txTracker.addTiming(id2, 'sent');
console.log(txTracker.formatTimings(id2));

console.log(txTracker.getTxsByTag(['keep']));
