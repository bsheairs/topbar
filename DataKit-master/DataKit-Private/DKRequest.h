//
//  DKRequest.h
//  DataKit
//
//  Created by Erik Aigner on 24.02.12.
//  Copyright (c) 2012 chocomoko.com. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "DKConstants.h"

enum {
  DKResponseStatusSuccess = 200,
  DKResponseStatusError = 400
};
typedef NSInteger DKResponseStatus;

@interface DKRequest : NSObject
@property (nonatomic, copy, readonly) NSString *endpoint;
@property (nonatomic, assign) DKCachePolicy cachePolicy;

+ (DKRequest *)request;

+ (BOOL)canParseResponse:(NSHTTPURLResponse *)response;
+ (id)parseResponse:(NSHTTPURLResponse *)response withData:(NSData *)data error:(NSError **)error;

- (id)initWithEndpoint:(NSString *)absoluteString;

- (id)sendRequestWithMethod:(NSString *)apiMethod error:(NSError **)error;
- (id)sendRequestWithObject:(id)JSONObject method:(NSString *)apiMethod error:(NSError **)error;
- (id)sendRequestWithData:(NSData *)data method:(NSString *)apiMethod error:(NSError **)error;

@end

@interface DKRequest (Wrapping)

+ (id)iterateJSON:(id)JSONObject modify:(id (^)(id obj))handler;
+ (id)wrapSpecialObjectsInJSON:(id)obj;
+ (id)unwrapSpecialObjectsInJSON:(id)obj;

@end

@interface DKRequest (Logging)

+ (void)logData:(NSData *)data isOut:(BOOL)isOut;

@end