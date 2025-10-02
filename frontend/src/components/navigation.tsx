"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MessageCircle, Bookmark, LogOut, User, Trophy } from "lucide-react"
import useLogin from "@/hooks/use-Login";
import Logo from "@/components/logo";

interface NavigationProps {
  newMessageCount?: number
}

export function Navigation({ newMessageCount = 0 }: NavigationProps) {
  const { isLoggedIn, member, logout } = useLogin();

  const userType = (member) ? member.role : null;
  
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />

          {/* 네비게이션 메뉴 */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/ranking" className="flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>랭킹</span>
              </Link>
            </Button>

            {!isLoggedIn ? (
              // 비회원 전용 버튼들
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">로그인</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">회원가입</Link>
                </Button>
              </>
            ) : (
              // 회원 전용 버튼들
              <>
                {/* 채팅 목록 버튼 */}
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <MessageCircle className="h-5 w-5" />
                      {newMessageCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                        >
                          {newMessageCount > 99 ? "99+" : newMessageCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">채팅 목록</h4>
                      <div className="space-y-2">
                        <div className="p-2 hover:bg-muted rounded-md cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                              <User className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">김프리랜서</p>
                              <p className="text-xs text-muted-foreground truncate">안녕하세요! 프로젝트 관련해서...</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-2 hover:bg-muted rounded-md cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                              <User className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">이개발자</p>
                              <p className="text-xs text-muted-foreground truncate">작업 완료했습니다!</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* 북마크 목록 버튼 (클라이언트 전용) */}
                {userType === "client" && (
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/mypage?tab=bookmarks">
                      <Bookmark className="h-5 w-5" />
                    </Link>
                  </Button>
                )}

                <Button variant="ghost" size="icon" asChild>
                  <Link href="/mypage">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>

                {/* 로그아웃 버튼 */}
                <Button variant="ghost" size="icon" onClick={()=>logout()}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
