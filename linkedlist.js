/* This is a doubly-linked list */

function LinkedListElement(elementData,previous,next,parent) {
  this.data=elementData;
  this.next=next;
  this.previous=previous;
  this.parent=parent;
  this.deleted=false;
}

function LinkedList() {
  this.first=null;
  this.length=0;
  this.last=null;

  this.pushFront=function (elementData) {
    var element, previous=null, next=null;
    next=this.first;
    element=new LinkedListElement(elementData,previous,next,this);
    if (this.length!=0) this.first.previous=element;
    this.first=element;
    if (this.length==0) this.last=element;
    this.length++;
  }
  
  this.pushBack=function(elementData) {
    var element=new LinkedListElement(elementData,this.last,null,this);
    if (this.length!=0) {
      if (this.last!=null) {
        this.last.next=element;
      }
      else {
        postMortemDebug="Arrived in a cell of length "+this.length+" that has a null last and first="+this.first;
        backtrace();
      }
    }
    this.last=element;
    if (this.length==0) this.first=element;
    this.length++;
    return element;
  }

  this.remove=function(linkedlistelement) {
    if (linkedlistelement.deleted!==false) {
      postMortedDebug="Trying to remove an element that was already deleted";
      backtrace();
    }
    if (linkedlistelement.parent!=this) {
      postMortemDebug="Does not correspond";
      backtrace();
    }
    //TODO Very ugly !! Patching a bug !!
    //if (this.length==1 && this.first
    if (linkedlistelement==this.first && linkedlistelement==this.last) {
      this.first=null;
      this.last=null;
    } else if (linkedlistelement==this.first) {
      this.first=linkedlistelement.next;
      this.first.previous=null;
    }
    else if (linkedlistelement==this.last) {
      this.last=linkedlistelement.previous;
      if (this.last!=null)
        this.last.next=null;
    }
    else {
      //FIXME Error : pretty much means we are trying to remove an object that is not part of the list. Happens when there is too much overlap
      if (linkedlistelement.next==null || linkedlistelement.previous==null) {
        postMortemDebug+=' the list has '+this.length+' elements left. First='+this.first+' and last='+this.last;
        backtrace();
      } else {
        linkedlistelement.next.previous=linkedlistelement.previous;
        linkedlistelement.previous.next=linkedlistelement.next;
      }
    }
    this.length--;
    linkedlistelement.deleted=true;
  }
}
