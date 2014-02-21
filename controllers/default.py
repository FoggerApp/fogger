# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

#########################################################################
## This is a sample controller
## - index is the default action of any application
## - user is required for authentication and authorization
## - download is for downloading files uploaded in the db (does streaming)
## - call exposes all registered services (none by default)
#########################################################################

@auth.requires_login()
def index():
    """
    example action using the internationalization operator T and flash
    rendered by views/default/index.html or views/generic.html

    if you need a simple wiki simply replace the two lines below with:
    return auth.wiki()
    """
    redirect(URL(c='default', f='map'))
    return dict(form=auth())

    response.flash = T("Welcome to web2py!")
    return dict(message=T('Hello World'))

@request.restful()
def api():
    def GET(*args,**vars):

        # GET /default/api/location/uid?nelat=...&...
        #                   arg0   arg1 vars['nelat']
        if len(request.args) > 2:
            return dict(content=None, errors=['Invalid request arguments. Too many arguments'])
        if len(request.args)<=1:
            return dict(content=None, errors=['Invalid request arguments. Too few arguments: Specify User ID ie location/1'])

        if request.args[0] == "location":
            uid=request.args[1]
            if "nelat" in request.vars and "nelng" in request.vars and "swlat" in request.vars and "swlng" in request.vars:
                nelat=float(request.vars["nelat"])
                nelng=float(request.vars["nelng"])
                swlat=float(request.vars["swlat"])
                swlng=float(request.vars["swlng"])
                sp=db.geolocation.loc
                polygon=geoPolygon((swlat, swlng),(nelat, swlng),(nelat, nelng),(swlat, nelng),(swlat, swlng))
                contains=sp.st_within(polygon)
                return dict(content=dict(
                                         url=URL(),
                                         locations=db((db.geolocation.uid==uid)&(contains)).select(db.geolocation.ALL)),
                    errors=[]
                    )
            return dict(content=None, errors=['Invalid amount of variables.'])
    def POST(*args,**vars):
        # Import JSON parser
        import gluon.contrib.simplejson as json
         # POST /default/api/location/
        #                    arg0
        if len(request.args) > 1:
            return dict(content=None, errors=['Invalid request arguments. Too many arguments'])

        if request.args[0] == "location":

            # Get HTML request body
            body = request.body.read()

            # Parse the body
            body = json.loads(body)

            uid=body['uid']
            latitute=body['loc']['lat']
            longtitute=body['loc']['lng']

            # Check counts the points within a certain range
            dist = db.geolocation.loc.st_distance(geoPoint(latitute, longtitute))
            check = db(dist<0.001).select(db.geolocation.ALL, dist.with_alias("dist"))

            result = None
            if len(check) == 0:
                result = db.geolocation.insert(uid=uid,loc=geoPoint(latitute, longtitute))
            else:
                return dict(content = check.as_list(),
                        errors=[]
                        )

            return dict(content = dict(
                                       id = result
                                       ),
                        errors=[]
                        )
        else:
            return dict(content=None, errors=['Invalid database object.'])

    def PUT(*args,**vars):
        return dict()
    def DELETE(*args,**vars):
        return dict()
    return locals()

def user():
    """
    exposes:
    http://..../[app]/default/user/login
    http://..../[app]/default/user/logout
    http://..../[app]/default/user/register
    http://..../[app]/default/user/profile
    http://..../[app]/default/user/retrieve_password
    http://..../[app]/default/user/change_password
    http://..../[app]/default/user/manage_users (requires membership in
    use @auth.requires_login()
        @auth.requires_membership('group name')
        @auth.requires_permission('read','table name',record_id)
    to decorate functions that need access control
    """
    return dict(form=auth())




@auth.requires_login()
def profile():
    return dict()

@auth.requires_login()
def map():

    return dict()

@cache.action()
def download():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    return response.download(request, db)


def call():
    """
    exposes services. for example:
    http://..../[app]/default/call/jsonrpc
    decorate with @services.jsonrpc the functions to expose
    supports xml, json, xmlrpc, jsonrpc, amfrpc, rss, csv
    """
    return service()


@auth.requires_signature()
def data():
    """
    http://..../[app]/default/data/tables
    http://..../[app]/default/data/create/[table]
    http://..../[app]/default/data/read/[table]/[id]
    http://..../[app]/default/data/update/[table]/[id]
    http://..../[app]/default/data/delete/[table]/[id]
    http://..../[app]/default/data/select/[table]
    http://..../[app]/default/data/search/[table]
    but URLs must be signed, i.e. linked with
      A('table',_href=URL('data/tables',user_signature=True))
    or with the signed load operator
      LOAD('default','data.load',args='tables',ajax=True,user_signature=True)
    """
    return dict(form=crud())
