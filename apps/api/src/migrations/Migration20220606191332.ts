import { Migration } from '@mikro-orm/migrations';

export class Migration20220606191332 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "shortcode" alter column "url" type varchar(2048) using ("url"::varchar(2048));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "shortcode" alter column "url" type varchar(255) using ("url"::varchar(255));');
  }

}
