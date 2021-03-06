# Step by step

- [Init](#init)
- [Update User model](#update-user-model)
- [Create service Mailer](#create-service-mailer)
- [Create service AuthManagement](#create-service-authmanagement)

## Init

```text
$ feathers g app
? Do you want to use JavaScript or TypeScript? TypeScript
? Project name feathers-authentication-management-ts-example
? Description Show case of sign up verification, forgotten password reset, and other capabilities to local feathers-authentication
? What folder should the source files live in? src
? Which package manager are you using (has to be installed globally)? npm
? What type of API are you making? REST, Realtime via Socket.io
? Which testing framework do you prefer? Jest
? This app uses authentication Yes
? What authentication strategies do you want to use? (See API docs for all 180+ supported oAuth providers) Username + Password (Local)
? What is the name of the user (entity) service? users
? What kind of service is it? Sequelize
? Which database are you connecting to? SQLite
? What is the database connection string? sqlite://feathers_authentication_management_ts_example.sqlite
```

## Update User model

If using models (in this example `sequelize` with `sqlite`) we have to update the model

```typescript
{
  isVerified: { type: Boolean },
  verifyToken: { type: String },
  verifyShortToken: { type: String },
  verifyExpires: { type: Date }, // or a long integer
  verifyChanges: // an object (key-value map), e.g. { field: "value" }
  resetToken: { type: String },
  resetShortToken: { type: String },
  resetExpires: { type: Date }, // or a long integer
}
```

See users.verifyChanges get/set for storage of object type converted to text [users.models.ts](src/models/users.model.ts#L35)

## Create service Mailer

### Install dependencies

```bash
npm install feathers-mailer nodemailer-smtp-transport feathers-hooks-common --save
npm install @types/nodemailer-smtp-transport --save-dev
```

```bash
feathers g service
? What kind of service is it? A custom service
? What is the name of the service? Mailer
? Which path should the service be registered on? /mailer
? Does the service require authentication? Yes
   create src/services/mailer/mailer.service.ts
    force src/services/index.ts
   create src/services/mailer/mailer.class.ts
   create src/services/mailer/mailer.hooks.ts
   create test/services/mailer.test.ts
```

edit [`src/services/mailer/mailer.service.ts`](./src/services/mailer/mailer.service.ts) [`src/services/mailer/mailer.hooks.ts`](./src/services/mailer/mailer.hooks.ts) and delete `src/services/mailer/mailer.class.ts`

## Create service AuthManagement

### Install feathers-authentication-management-ts

```bash
npm install feathers-authentication-management-ts --save
```

### Generate AuthManagement service

```bash
$ feathers generate service
? What kind of service is it? A custom service
? What is the name of the service? AuthManagement
? Which path should the service be registered on? /auth-management
? Does the service require authentication? Yes
   create src/services/auth-management/auth-management.service.ts
    force src/services/index.ts
   create src/services/auth-management/auth-management.class.ts
   create src/services/auth-management/auth-management.hooks.ts
   create test/services/auth-management.test.ts
```

edit [`src/services/auth-management/auth-management.service.ts`](./src/services/auth-management/auth-management.service.ts) [`src/services/auth-management/auth-management.hooks.ts`](./src/services/auth-management/auth-management.hooks.ts) delete `src/services/auth-management/auth-management.class.ts`

add [`src/services/auth-management/notifier.ts`](./src/services/auth-management/notifier.ts)

edit [`src/services/users/users.hooks.ts`](./src/services/users/users.hooks.ts)
