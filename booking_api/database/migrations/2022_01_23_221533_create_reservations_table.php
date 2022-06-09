<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReservationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id()->unique()->autoIncrement();;
            $table->unsignedBigInteger('user_id')->required();
	        $table->integer('slot')->required();
	        $table->dateTimeTz('start')->required();
	        $table->dateTimeTz('end')->required();
            $table->string('timezone')->required();
            $table->double('paid')->required();
            $table->timestamps();
        });
        
        Schema::table('reservations', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reservations');
    }
}
