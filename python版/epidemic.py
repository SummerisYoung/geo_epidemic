
# coding: utf-8

# In[3]:


import requests

headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'}
data = {'_':'1580443848435'}
response = requests.get('https://interface.sina.cn/news/wap/fymap2020_data.d.json?',params=data,headers=headers)


# In[4]:


import json

if response.status_code == 200:
    content=json.loads(response.text).get('data')
    times = content['times']
    lists = content['list']
    confirmLists = [] # 确诊
    suspectLists = [] # 疑似
    deathLists = [] # 死亡
    cureLists = [] #治愈
    for l in lists:
        confirmList = []
        confirmList.append(l['name'])
        confirmList.append(l['value'])
        confirmLists.append(confirmList)
        
        suspectList = []
        suspectList.append(l['name'])
        suspectList.append(l['susNum'])
        suspectLists.append(suspectList)
        
        deathList = []
        deathList.append(l['name'])
        deathList.append(l['deathNum'])
        deathLists.append(deathList)
        
        cureList = []
        cureList.append(l['name'])
        cureList.append(l['cureNum'])
        cureLists.append(cureList)
    
# print(confirmLists)
# print(suspectLists)
# print(deathLists)
# print(cureLists)


# In[8]:


from pyecharts.charts import Map
from pyecharts import options as opts

def geo_epidemic() -> Map:
    pieces=[{'min':1000,'color':'#880000'},
    {'min':500,'max':1000,'color':'#CC0000'},
    {'min':100,'max':499,'color':'#FF3333'},
    {'min':10,'max':99,'color':'#FF7744'},
    {'min':1,'max':9,'color':'#FFC8B4'},
    {'max':1,'color':'#FFFFFF'}]
    c = (
         Map(init_opts=opts.InitOpts(width='1400px',height='700px'))
        .add("确诊", confirmLists)
        .add("疑似", suspectLists,is_selected=False)
        .add("死亡", deathLists,is_selected=False)
        .add("治愈", cureLists,is_selected=False)
        .set_series_opts(label_opts=opts.LabelOpts(is_show=True))
        .set_global_opts(
            visualmap_opts=opts.VisualMapOpts(is_piecewise=True,pieces=pieces,pos_left='5%',pos_top='middle'),
            title_opts=opts.TitleOpts(title='武汉肺炎疫情地图',subtitle=times,pos_left='center',pos_top='10%')
        )
    )
    return c

geo_epidemic().render('show.html')

