//
//  DKMapReduce.m
//  DataKit
//
//  Created by Erik Aigner on 11.03.12.
//  Copyright (c) 2012 chocomoko.com. All rights reserved.
//

#import "DKMapReduce.h"

@interface DKMapReduce ()
@property (nonatomic, copy, readwrite) NSString *mapFunction;
@property (nonatomic, copy, readwrite) NSString *reduceFunction;
@property (nonatomic, copy, readwrite) NSString *finalizeFunction;
@end

@implementation DKMapReduce
DKSynthesize(context)
DKSynthesize(resultProcessor)
DKSynthesize(mapFunction)
DKSynthesize(reduceFunction)
DKSynthesize(finalizeFunction)

- (id)init {
  self = [super init];
  if (self) {
    self.resultProcessor = ^(id result) { return result; };
  }
  return self;
}

- (void)map:(NSString *)mapFunc reduce:(NSString *)reduceFunc {
  [self map:mapFunc reduce:reduceFunc finalize:nil];
}

- (void)map:(NSString *)mapFunc reduce:(NSString *)reduceFunc finalize:(NSString *)finalizeFunc {
  if (mapFunc.length == 0) {
    return [NSException raise:NSInternalInconsistencyException format:@"Map function missing"];
  }
  if (reduceFunc.length == 0) {
    return [NSException raise:NSInternalInconsistencyException format:@"Reduce function missing"];
  }
  
  // Define the trim set
  NSCharacterSet *trimSet = [NSCharacterSet whitespaceAndNewlineCharacterSet];
  
  NSString *(^trim)(NSString *) = ^(NSString *func) {
    if (func.length > 0) {
      NSArray *comp = [func componentsSeparatedByString:@"\n"];
      NSMutableArray *assemble = [NSMutableArray new];
      for (NSString *line in comp) {
        NSString *trimmed = [line stringByTrimmingCharactersInSet:trimSet];
        if (trimmed.length > 0) {
          [assemble addObject:trimmed];
        }
      }
      return [assemble componentsJoinedByString:@"\n"];
    }
    return (NSString *)nil;
  };
  
  self.mapFunction = trim(mapFunc);
  self.reduceFunction = trim(reduceFunc);
  self.finalizeFunction = trim(finalizeFunc);
}

@end
