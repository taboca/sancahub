/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is TelaSocial
 *
 * The Initial Developer of the Original Code is Taboca TelaSocial.
 * Portions created by the Initial Developer are Copyright (C) 2010 
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Marcio Galli   <mgalli@taboca.com>
 *      Rafael Sartori <faelsartori@gmail.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var app =  {
	feedURL : URL_TWIT,
    MAX_ITEMS: 6,
	feed    : null, 
	start : function() {

        this.elementStore = document.createElement('div');
		this.elementStore.setAttribute("id","container");
		document.body.appendChild(this.elementStore);
		this.element = document.createElement('div');
		this.element.className="";
		this.element.id = Math.random();
		this.tweetQueue = new Array();
		var first = document.createElement("div");
		this.firstId = "firstItemRows";
		first.id = this.firstId;

		this.tweetRepeated = {};
		this.element.appendChild(first);
		document.body.appendChild(this.element);
		var self = this;
		setTimeout( function(){self.updateFeed()},1500);
	},

	init : function () { 
		this.feed = new t8l.feeds.Feed(this.feedURL);
//		this.feed.setResultFormat(t8l.feeds.Feed.XML_FORMAT);
        this.feed.setResultFormat('text'); // differs from google now

		this.feed.setNumEntries(10);
	} ,

    total:0,
    flipflop:true,

    flip: function () { 

             if(this.flipflop) { 
                 this.flipflop=false; return 'color:white';
             } 
             else { 
                 this.flipflop=true; return 'color:gray';
             } 
    },

	render : function() {
		var counter = 0;
		var self = this;
		if(this.tweetQueue.length<1) { 
			setTimeout( function(){self.updateFeed()},1099);
		} else { 
			var k = document.createElement('div');
			k.className="item";
			var kk = document.createElement('div');
			kk.className="itemshadow";
			k.innerHTML = this.tweetQueue.pop();
			//this.element.insertBefore(k, this.element.firstChild);
			this.element.appendChild(k);
			this.element.appendChild(kk);
			k.className="item";

			var localItem = $($('div.item'));
            var llLength = localItem.length;
			var localItem = $($('div.item')[llLength-1]);
            localItem.find('h3').attr('style',''+self.flip()+' ! important');

			this.total++;
			if(this.total>this.MAX_ITEMS) { 
				var localItem = $($('div.item')[0]);
				var title = localItem.find('h3').text();
				var desc = localItem.find('.desc').text();
				var descFull = localItem.find('.descFull').text();
				var src = localItem.find('img').attr('src');
				var obj = {'title':title,'desc':desc,'src':src, 'descFull':descFull};
				//t8l.message('/main/destaques', JSON.stringify(obj));
				//$($("div.item")[0]).animate({height:'hide'}, 1000, function() {  $($("div.item")[0]).remove() } );
				setTimeout(function() { $($("div.item")[0]).remove() } ,2000);
				setTimeout(function() { $($("div.itemshadow")[0]).remove() } ,2000);

			        $("div.item")[0].setAttribute("style","-moz-transition-property: margin-top;-moz-transition-duration:1s;margin-top:-120px ");



				this.total--;
			} 
			setTimeout( function () { self.render() }, 4000);
		} 
	},

	updateFeed : function() {
		var self =this;
		this.feed.load( function (e) { self.__feedUpdated(e) } );
	},

	__feedUpdated : function(result) {

        this.tweetRepeated = {};
		var self  = this; 
//		var cc=0;

        if(result.error) { };

        var text = result.xmlDocument;
        var objs = $.parseJSON(text);

        for( var k in objs) {
//          if(cc<5) { 
//            var out = doFilter(this); 
              out = {}; 
              out.title = objs[k].text;
              out.subtitle='';
              out.body='';
              out.src=objs[k].user.profile_image_url;
            self.tweetQueue.push( '<div class=""><img style="float:left;margin-right:10px;" src="'+out.src+'" /><h3>'+out.title+'</h3><div class="desc">'+out.subtitle+'</div><div class="descFull" style="display:none">'+out.body+'</div></div>' );
 //         cc++;
        }

		var self = this;
		self.render();
	}
}

