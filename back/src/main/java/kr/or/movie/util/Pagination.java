package kr.or.movie.util;

import org.springframework.stereotype.Component;

@Component
public class Pagination {
	public PageInfo getPageInfo(int reqPage, int numPerPage, int pageNaviSize, int totalCount) {
		int end = reqPage*numPerPage;
		int start = end-numPerPage+1;
		int totalPage = (int)Math.ceil(totalCount/(double)numPerPage);//나머지가 있으면 올림해라.
		int pageNo = ((reqPage-1)/pageNaviSize)*pageNaviSize+1;//pageNaviSize가 5면 5까지는 1
		PageInfo pi = new PageInfo(start,end,pageNo,pageNaviSize,totalPage);
		
		
		return pi;		
	}
}
