import { getEndedAuctions } from '../../lib/getEndedOptions';

async function processAuctions(event, content) {
    const auctionsTOClose = await getEndedAuctions();
    console.log(auctionsTOClose);
}

export const handler = processAuctions;