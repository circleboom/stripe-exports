# stripe-exports

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)

## About <a name = "about"></a>

Stripe-Exports helps you download and export subscriber &amp; customer data from your Stripe account.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

```bash
npm i
```

### Installing

Before start you need to update Stripe keys in config.json with yours. Go grab your keys here: https://dashboard.stripe.com/account/apikeys

```
{
    "dev": {
        "stripe_key": "YOUR_STRIPE_DEV_KEY"
    },
    "prod": {
        "stripe_key": "YOUR_STRIPE_LIVE_KEY"
    }
}
```

## Usage <a name = "usage"></a>

Stripe-Exports utilizes yargs to provide a meaningful CLI interface. You can get help by using --help option.

```bash
node subscribers --help
```

| Option | Description |
| ------ | ----------- |
|-c, --config | Path for the config file. Default is ./config.json. Don't forget to see [your keys here](https://dashboard.stripe.com/account/apikeys)|
|-e, --env|Choose your environment. This loads environment data from config.json [choices: "dev", "test", "prod"]|
|-s, --status|  (optional) The status of the subscriptions to retrieve. [choices: "all", "active", "canceled", "incomplete", "incomplete_expired", "trialing", "past_due", "unpaid"]|
|-l, --limit|(optional) A limit on the number of objects to be returned. The default is 100.|

*Download active 500 subscribers from Live data.*
```bash
node subscribers -e prod -l 500 -s active
```
