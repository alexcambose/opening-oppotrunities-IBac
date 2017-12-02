<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    public static $rules = [
        'title' => 'required|string|max:100|min:4',
        'slug' => 'required|string|max:100|min:4',
        'shortDescription' => 'required|string|max:240',
        'description' => 'required|string|max:4000',
        'difficulty' => 'required|numeric',
        'prerequisites' => 'array',
        'purpose' => 'required|string|max:2000',
        'purposeWhatWillLearn' => 'array',
        'targetClassLevel' => 'required|numeric',
        'image' => 'image|mimes:jpeg,png,jpg|max:10000000',
    ];
    protected $appends = [
        '_image',
        '_user',
    ];
    public function getImageAttribute(){
        return Media::find($this->image_id);
    }
    public function getUserAttribute(){
        return User::find($this->user_id);
    }


}
