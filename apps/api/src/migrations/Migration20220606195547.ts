import { Migration } from '@mikro-orm/migrations';

export class Migration20220606195547 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "shortcode" alter column "hits" type int using ("hits"::int);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "shortcode" alter column "hits" type varchar(255) using ("hits"::varchar(255));');
  }

}
