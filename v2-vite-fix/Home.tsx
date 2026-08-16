          </span>
          <span className="text-xs font-medium text-muted-foreground">{unit}</span>
        </div>
        <div className="text-xs text-muted-foreground mb-2">{getStatusText()}</div>
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn("absolute top-0 left-0 h-full transition-all duration-500", color)} 
            style={{ width: `${Math.min(100, (value / (max * 1.5)) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          <span>Target:</span>
          <span className="font-medium">{min}-{max}{unit}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryBar({ label, value, target, color }: { label: string, value: number, target: number[], color: string }) {