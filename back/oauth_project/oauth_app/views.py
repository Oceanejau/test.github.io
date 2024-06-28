from django.shortcuts import render

# Create your views here.
# oauth_app/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests

CLIENT_ID = 'u-s4t2ud-00d16a6189e88b09e29da3901b88914a2c9cbaea9f694ef4b02070089c7abcae'
CLIENT_SECRET = 'votre_client_secret'
REDIRECT_URI = 'https://oceanejau.github.io/test.github.io/'

@csrf_exempt
def get_token(request):
    if request.method == 'POST':
        code = request.POST.get('code')
        token_url = 'https://api.intra.42.fr/oauth/token'
        data = {
            'grant_type': 'authorization_code',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'code': code,
            'redirect_uri': REDIRECT_URI
        }
        response = requests.post(token_url, data=data)
        return JsonResponse(response.json())

# oauth_app/views.py
@csrf_exempt
def get_user_info(request):
    if request.method == 'POST':
        token = request.POST.get('token')
        user_url = 'https://api.intra.42.fr/v2/me'
        headers = {
            'Authorization': f'Bearer {token}'
        }
        response = requests.get(user_url, headers=headers)
        return JsonResponse(response.json())
