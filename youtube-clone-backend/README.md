Sample app using Nestjs and Angular

Notes:

-   TypeORM migrations are run automatically on start. Existing rows may be missing values for columns that
    are newly added. We can add @Column({ nullable: true }) for now to the column definition to avoid this.

    TODO - See migrations documentation: https://github.com/typeorm/typeorm/blob/master/docs/migrations.md

    -   data-source.ts defines config for TypeORM CLI to run migrations
    -   Create the stub migration file: npm run typeorm migration:create -d ./migrations/
        -   Add -n to give it a name, otherwise it will be named with a timestamp
        -   Add -d to specify the directory
    -   Run migrations using data-source.ts config: npm run typeorm migration:run -d dist/data-source.js

    Errors:

    -   query: SELECT \* FROM current_schema()
        Error during migration run:
        Error: Cannot find module 'src/role/models/role.entity'

        Fix:

        -   Make sure to build the project before running migrations: npm run build
        -   Run the migration command with the compiled js file: npm run typeorm migration:run -d dist/data-source.js
        -   Can probably do something with ts-node instead as well

        -   When seeding data, to avoid module resolution errors, use ts-node with tsconfig-paths.
        -   Make sure "paths" property is added to tsconfig.json.
        -   ts-node -r tsconfig-paths/register seeds/1-add-role-to-user-table-seed.ts
