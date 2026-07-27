<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    /**
     * Upload a thumbnail image and return its public URL.
     * Accepts: image/* — max 3 MB.
     */
    public function thumbnail(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:3072', // 3 Mo
        ]);

        $path = $request->file('image')->store('thumbnails', 'public');
        $url  = asset('storage/' . $path);

        return response()->json(['url' => $url], 201);
    }
}
