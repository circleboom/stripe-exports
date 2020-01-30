# stripe-exports

!["Stripe Exports by Circleboom"](https://repository-images.githubusercontent.com/234569929/61297680-3922-11ea-84ce-edb40f8d768d)

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Todo](#todo)
- [About Circleboom](#circleboom)
- [Contact Us](https://circleboom.com/contact-us)

## About<a name = "about"></a>

Stripe-Exports helps you download and export subscriber &amp; customer data from your Stripe account.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

Install dependencies via npm

```bash
npm i
```

### Installing

Before start you need to update Stripe keys in config.json with yours. Go grab your keys here: https://dashboard.stripe.com/account/apikeys

```json
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
|-s, --status|(optional) The status of the subscriptions to retrieve. [choices: "all", "active", "canceled", "incomplete", "incomplete_expired", "trialing", "past_due", "unpaid"]|
|-b, -before|(optional) Gets the previous pages before the given subscription.|
|-a, -after|(optional) Gets the pages after the given subscription.|
|-l, --limit|(optional) A limit on the number of objects to be returned. The default is 100.|

### Download active 500 subscribers from Live data. ###
```bash
node subscribers -e prod -l 500 -s active

==> [11:13:27.519] Using the prod as config
==> [11:13:27.587] Stripe initialized with the prod token
==> [11:13:27.591] Starting to download all subscribers for in "active" statuses
==> [11:13:27.591] Getting the page 1 with 100 records 
==> [11:13:29.493] Getting the page 2 with 100 records after subscription: sub_Gabcdefghijklm
==> [11:13:31.166] Getting the page 3 with 100 records after subscription: sub_Gabcdefghijkln
==> [11:13:32.733] Getting the page 4 with 100 records after subscription: sub_Gabcdefghijkl0
==> [11:13:35.486] Getting the page 5 with 100 records after subscription: sub_Gabcdefghijklp
==> [11:13:36.874] Total subscribers: 500
==> [11:13:36.874] Mapping & stripping subscribers data to fit custom objects
==> [11:13:36.878] Total 500 records mapped
==> [11:13:36.884] All subscribers data is saved as subscribers.csv
==> [11:13:36.884] (◕‿◕) I'm done here, bye bye...
```

## Todo<a name = "todo"></a>

- Improve mapping of some customers data by honoring rate-limits
- Fields selection
- Download all customers with customers.js


## About Circleboom<a name = "circleboom"></a>

[Circleboom](https://circleboom.com) is a "Social Media Management" tool which enables users, brands, and SMBs to grow and strengthen their social network. As we're on our road to become a Multi Social Account Management tool, currently we primarily focus on Twitter and create sophisticated yet easy to use tools for it.

