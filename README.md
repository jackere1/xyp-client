# Xyp client template

Хур сервер лүү SOAP client ашиглаж холбогдох HTTP API template.

Xyp-ийн WSDL version >= 1.5.0 ихэнх сервисүүд хэрэглэглэгчээс authorization дата шаардана.

## Installation

Instructions on how to install and set up the project.

```bash
# Clone the repository
git clone https://github.com/jackere1/xyp-client.git

# Navigate to the project directory
cd xyp-client

# Install dependencies
npm install
```

## Usage

Instructions on how to use the project.

```bash
# Start the project
npm start
```

## Guide

Энэхүү project нь зөвхөн Хур-аас зөвшөөрөгдсөн хаяг бүхий сервер дээр ажиллах бөгөөд өгөгдсөн token болон certificate-ийн тусламжтайгаар хандах эрхтэй.

1. Хур-ийн сервисийг дуудаж ашиглаж буй жишээ - [src/service/ciziten.service.ts](src/service/ciziten.service.ts)
2. Хэрэглэгчээс auth дата явуулах үед хэрэглэх сервисүүдийг зааж өгөх [src/service/otp.service.ts](src/service/otp.service.ts)
