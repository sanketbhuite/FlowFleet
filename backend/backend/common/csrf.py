from django.views.decorators.csrf import csrf_exempt

def csrf_exempt_view(view):
    view.csrf_exempt = True
    return view
