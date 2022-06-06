import { Migration } from '@mikro-orm/migrations';

export class Migration20220606205010 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "shortcode" ("id" varchar(255) not null, "slug" varchar(255) not null, "url" varchar(2048) not null, "hits" int not null default 0, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "status" text check ("status" in (\'disabled\', \'enabled\')) not null);');
    this.addSql('alter table "shortcode" add constraint "shortcode_slug_unique" unique ("slug");');
    this.addSql('create index "shortcode_url_index" on "shortcode" ("url");');
    this.addSql('alter table "shortcode" add constraint "shortcode_pkey" primary key ("id");');

    this.addSql('drop table if exists "shortcode_entity" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "shortcode_entity" ("id" varchar(255) not null, "slug" varchar(255) not null, "url" varchar(2048) not null, "hits" int not null default 0, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "status" text check ("status" in (\'disabled\', \'enabled\')) not null);');
    this.addSql('alter table "shortcode_entity" add constraint "shortcode_entity_slug_unique" unique ("slug");');
    this.addSql('create index "shortcode_entity_url_index" on "shortcode_entity" ("url");');
    this.addSql('alter table "shortcode_entity" add constraint "shortcode_entity_pkey" primary key ("id");');

    this.addSql('drop table if exists "shortcode" cascade;');
  }

}
