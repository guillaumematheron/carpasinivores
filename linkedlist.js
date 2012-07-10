/* This is a doubly-linked list */

function LinkedListElement(elementData,previous,next) {
  this.data=elementData;
  this.next=next;
  this.previous=previous;
}

function LinkedList() {
  this.first=null;
  this.length=0;
  this.last=null;

  this.pushFront=function (elementData) {
    var element, previous=null, next=null;
    next=this.first;
    element=new LinkedListElement(elementData,previous,next,storeMatrixObject);
    if (this.length!=0) this.first.previous=element;
    this.first=element;
    if (this.length==0) this.last=element;
    this.length++;
  }
  
  this.pushBack=function(elementData) {
    var element=new LinkedListElement(elementData,this.last,null);
    if (this.length!=0) this.last.next=element;
    this.last=element;
    if (this.length==0) this.first=element;
    this.length++;
    return element;
  }

  this.remove=function(linkedlistelement) {
    if (linkedlistelement==this.first && linkedlistelement==this.last) {
      this.first=null;
      this.last=null;
    } else if (linkedlistelement==this.first) {
      this.first=linkedlistelement.next;
      this.first.previous=null;
    }
    else if (linkedlistelement==this.last) {
      this.last=linkedlistelement.previous;
      this.last.next=null;
    }
    else {
      //Error : pretty much means we are trying to remove an object that is not part of the list
      if (linkedlistelement.next==null || linkedlistelement.previous==null) backtrace();
      linkedlistelement.next.previous=linkedlistelement.previous;
      linkedlistelement.previous.next=linkedlistelement.next;
    }
    this.length--;
  }
}
