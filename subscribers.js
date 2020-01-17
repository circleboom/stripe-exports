// Creating CLI arguments
const argv = require('yargs')
    .alias('c', 'config')
    .describe('c', 'Path for the config file. Default is ./config.json. Don\'t forget to see your keys here: https://dashboard.stripe.com/account/apikeys')
    .alias('e', 'env')
    .describe('e', 'Choose your environment. This loads environment data from config.json')
    .choices('e', ['dev', 'test', 'prod'])
    .alias('s', 'status')
    .describe('s', '(optional) The status of the subscriptions to retrieve.  https://stripe.com/docs/api/subscriptions/list#list_subscriptions-status')
    .choices('s', ['all', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'trialing', 'past_due', 'unpaid'])
    .alias('l', 'limit')
    .describe('l', '(optional) A limit on the number of objects to be returned. The default is 100.')
    .help('help')
    .argv

const moment = require('moment');
let log = log => console.log(`==> [${moment().format('hh:mm:ss.SSS')}] ${log}`);

// module variables
const config = require(argv.config || './config.json');
const environment = argv.env || 'dev';
const status = argv.status || 'all';
const totalRecordLimit = argv.limit || 100;
const pageLimit = (totalRecordLimit > 100) ? 100 : totalRecordLimit;
const maxPages = (argv.limit) ? (totalRecordLimit > 100) ? (totalRecordLimit % 100 === 0) ? totalRecordLimit / 100 : parseInt(totalRecordLimit / 100) + 1 : 1 : null;
let outputFileName = 'subscribers.csv';

log(`Using the ${environment} as config`)
const configuration = config[environment];

var stripe = require('stripe')(configuration.stripe_key);
log(`Stripe initialized with the ${environment} token`)

const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require('fs');

//https://github.com/stripe/stripe-node
//https://stackoverflow.com/questions/47117218/fetching-all-stripe-customers-with-async-await
//https://zellwk.com/blog/async-await-in-loops/
//https://stackoverflow.com/questions/28714298/how-to-chain-and-share-prior-results-with-promises

let subscribers = []
let page = 0 // page count
log(`Starting to download all subscribers for in "${status}" statuses`)
getAllSubscribers()

// Download subscribers & get some of their customer data
async function getAllSubscribers() {

    // Get Subscribers
    const subscribers = await getSubscribers(null);

    // Re
    log(`Total subscribers: ${subscribers.length}`)
    await getSubscribersData(subscribers).then(async promises => {
        //resolve all promises
        const allSubscribers = await Promise.all(promises)

        log(`Total ${allSubscribers.length} records mapped`)

        // writing the output
        writeFile(createCSV(allSubscribers));

    }).catch(function(error) { console.error(error) });
}

// Basic sleep function
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// Get subscribers by page
function getSubscribers(starting_after) {
    const getPage = async function(starting_after) {

            page++;
            if (maxPages && page > maxPages) return;

            log(`Getting the page ${page} with ${pageLimit} records ${(starting_after!=null) ? `after subscription: ${starting_after}` : ``}`);

        const searchOptions = {
        limit: pageLimit,
        status: status}

        if (starting_after !== null)
            searchOptions.starting_after = starting_after

            // Call Stripe
        return stripe.subscriptions.list(searchOptions)
            .then(
                resolve => resolve.has_more ?
                getPage(resolve.data[resolve.data.length - 1].id).then(result =>
                    resolve.data.concat('', result)
                ) :
                resolve.data
            )
            .catch(function(error) { log(error) });
    }

    return getPage(starting_after)
}

// Process subscribers data
const getSubscribersData = async function(subscriptions) {
    log('Mapping &  stripping subscribers data to fit custom objects')
    return await subscriptions.map(async subscription => {
        let s = {};
        if (subscription) {
            s = new subscriber(
                subscription.id,
                subscription.customer,
                subscription.plan.id,
                subscription.cancel_at_period_end,
                subscription.canceled_at
            );

            // You may want to get some customer data here
            // However, Stripe's rate-limit might be a challange.
            // Feel free to suit your needs
            
            // await sleep(100);
            // await stripe.customers.retrieve(subscription.customer).then(
            //     function(customer) {
            //         s.email = customer.email;
            //         s.screenname = `@${customer.metadata.screenname}`;
            //         s.twitterid = customer.metadata.id;
            //     }
            // );

            if (subscription.cancel_at_period_end)
                s.canceled_at = moment(subscription.current_period_end * 1000).local().format('YYYY-MM-DD HH:mm:ss')
        }
        return s
    })
}

// Custom minified subscriber object model
function subscriber(subscription_id, customer, plan_id, cancel_at_period_end, canceled_at, email, screenname, twitterid) {
    this.customer = customer;
    this.subscription_id = subscription_id;
    this.plan_id = plan_id;
    this.cancel_at_period_end = cancel_at_period_end;
    this.canceled_at = canceled_at;
    this.email = email;
    this.screenname = screenname;
    this.twitterid = twitterid
}

// Convert Array to CSV
function createCSV(dataArrays) {
    const header = ['customer', 'subscription_id', 'plan_id', 'cancel_at_period_end', 'canceled_at', 'email', 'screenname', 'twitterid'];
    const csvFromArrayOfArrays = convertArrayToCSV(dataArrays, {
        header,
        separator: ';'
    });

    return csvFromArrayOfArrays
}

// File output
function writeFile(content) {
    fs.writeFile(outputFileName, content, 'utf8', function(err) {
        if (err) {
            return console.log(err);
        }
    log(`All subscribers data is saved as ${outputFileName}`);
    log(`(◕‿◕) I'm done here, bye bye...`)
    });
}