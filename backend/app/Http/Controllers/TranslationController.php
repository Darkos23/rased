<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TranslationController extends Controller
{
    public function translate(Request $request)
    {
        $data = $request->validate([
            'text'        => 'required|array|min:1|max:50',
            'text.*'      => 'required|string|max:5000',
            'target_lang' => 'required|in:FR,EN',
        ]);

        $apiKey = config('services.deepl.api_key');

        if (! $apiKey) {
            return response()->json(['error' => 'DeepL API key not configured.'], 503);
        }

        // DeepL Free API uses api-free.deepl.com, Pro uses api.deepl.com
        $baseUrl = str_ends_with($apiKey, ':fx')
            ? 'https://api-free.deepl.com/v2'
            : 'https://api.deepl.com/v2';

        $response = Http::withHeaders([
            'Authorization' => 'DeepL-Auth-Key ' . $apiKey,
        ])->post("{$baseUrl}/translate", [
            'text'        => $data['text'],
            'target_lang' => $data['target_lang'],
        ]);

        if (! $response->successful()) {
            return response()->json(['error' => 'Translation failed.'], $response->status());
        }

        return response()->json($response->json());
    }
}
