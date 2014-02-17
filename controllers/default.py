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
            
        # GET /default/api/location/uid
        #                  arg0     arg1
        if not len(request.args) > 1:
            return dict(content=None, errors=['Invalid request arguments.'])
        
        if request.args[0] == "location":
            uid=request.args[1]
            return dict(content=dict(
                      url=URL(),
                      locations=db(db.geolocation.uid==uid).select()),
                      errors=[], 
                    )
    def POST(*args,**vars):
        # Import JSON parser
        import gluon.contrib.simplejson as json

        if not len(request.args) > 0:
            return dict(content=None, errors=['Invalid request arguments.'])
        
        if request.args[0] == "location":

            # Get HTML request body
            body = request.body.read()

            # Parse the body
            body = json.loads(body)

            uid=body['uid']
            latitute=body['loc']['lat']
            longtitute=body['loc']['lng']
        
            return dict(content = dict(
                                    locations = db(
                                      db.geolocation.insert(uid=uid,loc=geoPoint(latitute, longtitute))
                                    )
                                  )
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
