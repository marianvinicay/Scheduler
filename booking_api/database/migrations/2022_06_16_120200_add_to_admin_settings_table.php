<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddToAdminSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('admin_settings', function(Blueprint $table) {
            $table->json('durations')->nullable();
            $table->integer('minInc')->required()->default(15);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('admin_settings', function(Blueprint $table) {
            $table->dropColumn('durations');
            $table->dropColumn('minInc');
        });
    }
}
