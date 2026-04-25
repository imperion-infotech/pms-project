/**
 * 
 */
package com.pms.auditlog.context;

/**
 * 
 */
public class RequestTraceContext {
	  private static final ThreadLocal<String> holder = new ThreadLocal<>();

	    public static void set(String traceId) {
	        holder.set(traceId);
	    }

	    public static String get() {
	        return holder.get();
	    }

	    public static void clear() {
	        holder.remove();
	    }
}
