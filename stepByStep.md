# Step by step

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

## User model

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

Q: using sqlite3 should verifyChanges be text?
