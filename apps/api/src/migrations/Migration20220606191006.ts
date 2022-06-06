import { Migration } from '@mikro-orm/migrations';

export class Migration20220606191006 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "shortcode" ("id" varchar(255) not null, "shortcode" varchar(255) not null, "url" varchar(255) not null, "hits" varchar(255) not null default 0, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "status" text check ("status" in (\'disabled\', \'enabled\')) not null);');
    this.addSql('alter table "shortcode" add constraint "shortcode_shortcode_unique" unique ("shortcode");');
    this.addSql('create index "shortcode_url_index" on "shortcode" ("url");');
    this.addSql('alter table "shortcode" add constraint "shortcode_pkey" primary key ("id");');
  }

}
