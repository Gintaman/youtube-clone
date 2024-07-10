Sample app using Nestjs and Angular

Notes:

-   TypeORM migrations are run automatically on start. Existing rows may be missing values for columns that
    are newly added. We can add @Column({ nullable: true }) for now to the column definition to avoid this.

    TODO - See migrations documentation: https://github.com/typeorm/typeorm/blob/master/docs/migrations.md
