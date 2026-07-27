<?php

namespace App\Services;

use App\Models\Meeting;
use App\Models\User;
use Firebase\JWT\JWT;

class JitsiJwtService
{
    private string $appId;
    private string $apiKeyId;
    private string $privateKey;

    public function __construct()
    {
        $this->appId      = config('services.jaas.app_id');
        $this->apiKeyId   = config('services.jaas.api_key_id');
        $this->privateKey = config('services.jaas.private_key');
    }

    /**
     * Génère un JWT JaaS pour un utilisateur et une réunion donnés.
     * L'animateur (host) reçoit moderator=true.
     */
    public function generateToken(User $user, Meeting $meeting): string
    {
        $isModerator = $user->id === $meeting->host_id || $user->isAdmin();
        $roomName    = $this->extractRoomName($meeting->google_meet_url);
        $now         = time();

        $payload = [
            'aud'     => 'jitsi',
            'iss'     => 'chat',
            'iat'     => $now,
            'exp'     => $now + 7200, // 2 heures
            'nbf'     => $now - 10,
            'sub'     => $this->appId,
            'room'    => $roomName,
            'context' => [
                'user' => [
                    'id'          => (string) $user->id,
                    'name'        => $user->name,
                    'email'       => $user->email,
                    'moderator'   => $isModerator,
                    'avatar'      => $user->avatar ?? '',
                ],
                'features' => [
                    'recording'        => true,
                    'livestreaming'    => false,
                    'transcription'    => false,
                    'outbound-call'    => false,
                ],
            ],
        ];

        $headers = ['kid' => $this->apiKeyId];

        return JWT::encode($payload, $this->privateKey, 'RS256', null, $headers);
    }

    /**
     * Extrait le nom de la salle depuis l'URL JaaS.
     * https://8x8.vc/vpaas-magic-cookie-xxx/fastef-uuid → fastef-uuid
     */
    private function extractRoomName(string $url): string
    {
        $parts = explode('/', $url);
        return end($parts) ?: '*';
    }
}
